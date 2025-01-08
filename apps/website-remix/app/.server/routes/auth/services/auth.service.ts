import type { ActionFunctionArgs } from "@remix-run/node";
import { container, injectable, singleton } from "tsyringe";

import { HttpResultCode, HttpStatusCode, isAuthError } from "@template/common";

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
    if (isAuthError(error)) {
      return {
        data: {
          success: false,
          error: null,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: body,
        toastMessage: defaultToastErrorMessage(
          "로그인에 실패하였습니다. 다시 시도해주세요.",
        ),
      } as const;
    }

    if (error) {
      const { statusCode, resultCode, error: innerError } = error;
      switch (statusCode) {
        case HttpStatusCode.NOT_FOUND: {
          return {
            data: {
              success: false,
              error: toErrorFormat("email", error),
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: body,
            toastMessage: null,
          } as const;
        }
        case HttpStatusCode.BAD_REQUEST: {
          return {
            data: {
              success: false,
              error:
                resultCode === HttpResultCode.INCORRECT_PASSWORD
                  ? toErrorFormat("password", error)
                  : toValidationErrorFormat(error),
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
        data,
        session,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      requestBody: body,
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
    if (isAuthError(error)) {
      return {
        data: {
          success: false,
          error: null,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: body,
        toastMessage: defaultToastErrorMessage(
          "회원가입에 실패하였습니다. 다시 시도해주세요.",
        ),
      } as const;
    }

    if (error) {
      const { statusCode, error: innerError } = error;
      switch (statusCode) {
        case HttpStatusCode.NOT_FOUND: {
          return {
            data: {
              success: false,
              error: toErrorFormat("email", error),
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: body,
            toastMessage: null,
          } as const;
        }
        case HttpStatusCode.BAD_REQUEST: {
          return {
            data: {
              success: false,
              error: toValidationErrorFormat(error),
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
        data,
        session,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      requestBody: body,
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
    if (isAuthError(error)) {
      return {
        data: {
          success: false,
          error,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: null,
        toastMessage: defaultToastErrorMessage(
          "세션 정보가 없거나 토큰이 유효하지 않습니다.",
        ),
      } as const;
    }

    if (error) {
      const { statusCode, error: innerError } = error;
      switch (statusCode) {
        case HttpStatusCode.NOT_FOUND: {
          return {
            data: {
              success: false,
              error,
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: null,
            toastMessage: defaultToastErrorMessage("유저가 존재하지 않습니다."),
          } as const;
        }
        case HttpStatusCode.BAD_REQUEST: {
          return {
            data: {
              success: false,
              error,
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: null,
            toastMessage:
              defaultToastErrorMessage("토큰값이 유효하지 않습니다."),
          } as const;
        }
        case HttpStatusCode.UNAUTHORIZED: {
          return {
            data: {
              success: false,
              error,
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: null,
            toastMessage: defaultToastErrorMessage(
              "세션 정보가 없거나 토큰이 유효하지 않습니다.",
            ),
          } as const;
        }
        default: {
          return {
            data: {
              success: false,
              error,
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: null,
            toastMessage: defaultToastErrorMessage(innerError.message),
          } as const;
        }
      }
    }

    return {
      data: {
        success: true,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      requestBody: null,
      toastMessage: null,
    } as const;
  }
}

export const token = AuthService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<AuthService>(token, {
  useClass: AuthService,
});
