import { ActionFunctionArgs } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import { HttpStatusCode } from "@template/common";

import { CacheService } from "~/.server/cache/cache.service";
import { AuthMiddleware } from "~/.server/middlewares/auth.middleware";
import { auth } from "~/.server/utils/auth";
import {
  defaultToastErrorMessage,
  invariantSession,
} from "~/.server/utils/shared";
import { api } from "~/libs/api";
import { toValidationErrorFormat } from "~/libs/error";
import { UserUpdateDto } from "../dto/user-update.dto";

@singleton()
@injectable()
export class UserService {
  constructor(
    @inject(AuthMiddleware.name)
    private readonly authMiddleware: AuthMiddleware,
    @inject(CacheService.name)
    private readonly cacheService: CacheService,
  ) {}

  async update(args: ActionFunctionArgs) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new UserUpdateDto();
    const body = (await dto.transform(args.request)).json();
    const submitId = dto.submitId();

    const { data, error } = await api
      .method("patch")
      .path("/api/v1/users")
      .setBody(body)
      .setAuthorization(session.access_token)
      .run();

    if (error) {
      const { statusCode, error: innerError } = error;
      switch (statusCode) {
        case HttpStatusCode.BAD_REQUEST: {
          return {
            data: {
              success: false,
              error: toValidationErrorFormat(error),
              submitId: undefined,
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: body,
            toastMessage: null,
          } as const;
        }
        default: {
          return {
            data: {
              success: false,
              error: null,
              submitId: undefined,
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: body,
            toastMessage: defaultToastErrorMessage(innerError.message),
          } as const;
        }
      }
    }

    return {
      data: {
        success: true,
        user: data.data,
        submitId,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      requestBody: body,
      toastMessage: null,
    } as const;
  }
}

export const token = UserService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<UserService>(token, {
  useClass: UserService,
});
