import { ActionFunctionArgs } from "@remix-run/node";
import { invariant } from "@epic-web/invariant";
import { container, inject, injectable, singleton } from "tsyringe";

import { HttpStatusCode } from "@template/common";

import { CacheService } from "~/.server/cache/cache.service";
import { AuthMiddleware } from "~/.server/middlewares/auth.middleware";
import { UserUpdateDto } from "~/.server/routes/users/dto/user-update.dto";
import { auth } from "~/.server/utils/auth";
import {
  defaultToastErrorMessage,
  invariantSession,
} from "~/.server/utils/shared";
import { api } from "~/libs/api";
import { toValidationErrorFormat } from "~/libs/error";

@singleton()
@injectable()
export class UserService {
  constructor(
    @inject(AuthMiddleware.name)
    private readonly authMiddleware: AuthMiddleware,
    @inject(CacheService.name)
    private readonly cacheService: CacheService,
  ) {}

  /**
   * @description 사용자 정보를 수정합니다.
   * @param {ActionFunctionArgs} args
   * @param {FormData?} formData
   */
  async update(args: ActionFunctionArgs, formData?: FormData) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new UserUpdateDto();
    const body = (await dto.transform(args.request, formData)).json();
    const submitId = dto.submitId();

    try {
      const { response } = await api
        .method("patch")
        .path("/api/v1/users")
        .setBody(body)
        .setAuthorization(session.access_token)
        .fetch();

      invariant(response, "response is required");

      if (response.error) {
        const { statusCode, error: innerError } = response.error;
        switch (statusCode) {
          case HttpStatusCode.BAD_REQUEST: {
            return {
              data: {
                success: false,
                error: toValidationErrorFormat(response.error),
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

      const user = response.data.data;

      // 세션 정보를 업데이트합니다.
      await this.authMiddleware.updateSession(authtication.authClient, user);

      return {
        data: {
          success: true,
          user,
          submitId,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: body,
        toastMessage: null,
      } as const;
    } catch {
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
        toastMessage: defaultToastErrorMessage(
          "유저 정보를 업데이트하는 중에 오류가 발생했습니다.",
        ),
      } as const;
    }
  }
}

export const token = UserService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<UserService>(token, {
  useClass: UserService,
});
