import type { ActionFunctionArgs } from "@remix-run/node";
import { container, injectable, singleton } from "tsyringe";

import type { SignInError, SignOutError, SignUpError } from "@template/auth";
import {
  AuthError,
  HttpResultCode,
  HttpStatusCode,
  isAuthError,
} from "@template/common";

import { SignInDto } from "~/.server/routes/auth/dto/signIn.dto";
import { SignUpDto } from "~/.server/routes/auth/dto/signUp.dto";
import { auth } from "~/.server/utils/auth";
import { defaultToastErrorMessage } from "~/.server/utils/shared";
import { toErrorFormat, toValidationErrorFormat } from "~/libs/error";

@injectable()
@singleton()
export class AuthService {
  /**
   * @description 로그인 액션 함수
   * @param {ActionFunctionArgs} args
   */
  async signIn(args: ActionFunctionArgs) {
    const signInDto = new SignInDto();
    const body = (await signInDto.transform(args.request)).json();
    const authtication = auth.handler(args);

    const { data, error, session } = await authtication.authClient.signIn(body);
    if (isAuthError<SignInError>(error)) {
      return this._signInError({ e: error, args, authtication });
    }

    return {
      data: {
        success: true,
        data,
        session,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      toastMessage: null,
    } as const;
  }

  /**
   * @description 회원가입 액션 함수
   * @param {ActionFunctionArgs} args
   */
  async signUp(args: ActionFunctionArgs) {
    const signUpDto = new SignUpDto();
    const body = (await signUpDto.transform(args.request)).json();
    const authtication = auth.handler(args);

    const { data, error, session } = await authtication.authClient.signUp(body);
    if (isAuthError<SignUpError>(error)) {
      return this._signUpError({ e: error, args, authtication });
    }

    return {
      data: {
        success: true,
        data,
        session,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      toastMessage: null,
    } as const;
  }

  /**
   * @description 로그아웃 액션 함수
   * @param {ActionFunctionArgs} args
   */
  async signOut(args: ActionFunctionArgs) {
    const authtication = auth.handler(args);

    const { error } = await authtication.authClient.signOut();
    if (isAuthError<SignOutError>(error)) {
      return this._signOutError({ e: error, args, authtication });
    }

    return {
      data: {
        success: true,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      toastMessage: null,
    } as const;
  }

  private _signInError<E = unknown>({
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
        "로그인에 실패하였습니다. 다시 시도해주세요.",
      ),
    } as const;

    const { statusCode, errorCode } = error;

    if (errorCode !== "validation_failed") {
      return defaultErrorToast;
    }

    const errorData = error.data as SignInError | undefined;
    if (!errorData) {
      return defaultErrorToast;
    }

    switch (statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return {
          data: {
            success: false,
            error: toErrorFormat("email", errorData),
          },
          requestInfo: {
            headers: authtication.headers,
            request: args.request,
          },
          toastMessage: null,
        } as const;
      }
      case HttpStatusCode.BAD_REQUEST: {
        const isIncorretPassword =
          errorData.resultCode === HttpResultCode.INCORRECT_PASSWORD;

        const validateError = isIncorretPassword
          ? toErrorFormat("password", errorData)
          : toValidationErrorFormat(errorData);

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

  private _signUpError<E = unknown>({
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
        "회원가입에 실패하였습니다. 다시 시도해주세요.",
      ),
    } as const;

    const { statusCode, errorCode } = error;

    if (errorCode !== "validation_failed") {
      return defaultErrorToast;
    }

    const errorData = error.data as SignUpError | undefined;
    if (!errorData) {
      return defaultErrorToast;
    }

    switch (statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return {
          data: {
            success: false,
            error: toErrorFormat("email", errorData),
          },
          requestInfo: {
            headers: authtication.headers,
            request: args.request,
          },
          toastMessage: null,
        } as const;
      }
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

  private _signOutError<E = unknown>({
    e: _,
    args,
    authtication,
  }: {
    e: AuthError<E>;
    args: ActionFunctionArgs;
    authtication: ReturnType<typeof auth.handler>;
  }) {
    return {
      data: {
        success: false,
        error: null,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      toastMessage: defaultToastErrorMessage(
        "로그아웃에 실패하였습니다. 다시 시도해주세요.",
      ),
    } as const;
  }
}

export const token = AuthService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<AuthService>(token, {
  useClass: AuthService,
});
