import { ActionFunctionArgs } from "@remix-run/node";
import { HttpStatusCode } from "@veloss/constants/http";
import { AuthError, isAuthError } from "@veloss/error/auth";
import { container, inject, injectable, singleton } from "tsyringe";

import { UserUpdateError } from "@template/auth";

import { CacheService } from "~/.server/cache/cache.service";
import { AuthMiddleware } from "~/.server/middlewares/auth.middleware";
import { UserUpdateDto } from "~/.server/routes/users/dto/user-update.dto";
import { auth } from "~/.server/utils/auth";
import {
  defaultToastErrorMessage,
  invariantSession,
} from "~/.server/utils/shared";
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
      const { error } = await authtication.authClient.updateUser(body);
      if (isAuthError<UserUpdateError>(error)) {
        return this._updateUserError({ e: error, args, authtication });
      }

      // 세션 정보를 업데이트합니다.
      const { user: newUser } = await this.authMiddleware.refreshSession(
        authtication.authClient,
        session.refresh_token,
      );

      return {
        data: {
          success: true,
          user: newUser,
          submitId,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
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
        toastMessage: defaultToastErrorMessage(
          "유저 정보를 업데이트하는 중에 오류가 발생했습니다.",
        ),
      } as const;
    }
  }

  private _updateUserError<E = unknown>({
    e,
    args,
    authtication,
  }: {
    e: AuthError<E>;
    args: ActionFunctionArgs;
    authtication: ReturnType<typeof auth.handler>;
  }) {
    const error = e.toJSON();
    const defaultErrorToast = {
      data: {
        success: false,
        error: null,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      toastMessage: defaultToastErrorMessage(
        "유저 정보를 업데이트하는 중에 오류가 발생했습니다.",
      ),
    } as const;

    const { statusCode, errorCode } = error;

    if (errorCode !== "validation_failed") {
      return defaultErrorToast;
    }

    const errorData = error.data as UserUpdateError | undefined;
    if (!errorData) {
      return defaultErrorToast;
    }

    switch (statusCode) {
      case HttpStatusCode.BAD_REQUEST: {
        const validateError = toValidationErrorFormat(errorData);

        if (!validateError) {
          return defaultErrorToast;
        }

        return {
          data: {
            success: false,
            error: validateError,
          },
          requestInfo: {
            headers: authtication.headers,
            request: args.request,
          },
          toastMessage: null,
        } as const;
      }
      default: {
        return defaultErrorToast;
      }
    }
  }
}

export const token = UserService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<UserService>(token, {
  useClass: UserService,
});
