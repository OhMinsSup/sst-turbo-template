import type { ApiResponseOptions } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";

import { HttpErrorNameEnum, HttpResultCode } from "@template/common";

import { HttpErrorDto } from "../../../shared/dtos/models/http-error.dto";
import { ValidationErrorDto } from "../../../shared/dtos/models/validation-error.dto";
import { AuthResponseDto } from "../../../shared/dtos/response/auth/auth-response.dto";
import { LogoutResponseDto } from "../../../shared/dtos/response/auth/logout-response.dto";

export const OpenApiAuthErrorDefine = {
  emailAlreadyExists: {
    exampleDescription: "이미 가입된 이메일인 경우 발생하는 에러",
    message: "이미 가입된 이메일입니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.NOT_EXIST_EMAIL,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["이메일 중복"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.NOT_EXIST_EMAIL,
          error: {
            error: HttpErrorNameEnum.BadRequestException,
            message: "이미 가입된 이메일입니다. 다시 시도해 주세요.",
          },
        },
      },
    },
  },
  signupValidation: {
    exampleDescription: "요청 데이터 검증 오류",
    message: "요청 데이터 검증 오류",
    resultCode: HttpResultCode.INVALID_REQUEST,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["검증 오류"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INVALID_REQUEST,
          error: {
            error: "ValidationError",
            message: "요청 데이터 검증 오류",
            validationErrorInfo: {
              email: ["잘못된 이메일 형식입니다."],
              username: [
                "이름은 문자열이어야 합니다.",
                "이름은 50자 이하여야 합니다.",
              ],
              password: [
                "비밀번호는 문자열이어야 합니다.",
                "비밀번호는 6자 이상이어야 합니다.",
                "비밀번호는 100자 이하여야 합니다.",
              ],
              provider: ["잘못된 인증 방식입니다."],
            },
          },
        },
      },
    },
  },
  signinValidation: {
    exampleDescription: "요청 데이터 검증 오류",
    message: "요청 데이터 검증 오류",
    resultCode: HttpResultCode.INVALID_REQUEST,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["검증 오류"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INVALID_REQUEST,
          error: {
            error: "ValidationError",
            message: "요청 데이터 검증 오류",
            validationErrorInfo: {
              email: ["잘못된 이메일 형식입니다."],
              password: [
                "비밀번호는 문자열이어야 합니다.",
                "비밀번호는 6자 이상이어야 합니다.",
                "비밀번호는 100자 이하여야 합니다.",
              ],
              provider: ["잘못된 인증 방식입니다."],
            },
          },
        },
      },
    },
  },
  roleNotFound: {
    exampleDescription: "Role이 없는 경우 발생하는 에러",
    message: "권한 등록에 대한 속성값이 필요합니다. 관리자에게 문의하세요.",
    resultCode: HttpResultCode.FAIL,
    statusCode: HttpStatus.NOT_FOUND,
    example: {
      ["권한을 찾을 수 없음"]: {
        value: {
          statusCode: HttpStatus.NOT_FOUND,
          resultCode: HttpResultCode.FAIL,
          error: {
            error: HttpErrorNameEnum.NotFoundException,
            message:
              "권한 등록에 대한 속성값이 필요합니다. 관리자에게 문의하세요.",
          },
        },
      },
    },
  },
  unsupportedAuthMethod: {
    exampleDescription: "지원하지 않는 가입 방법",
    message: "지원하지 않는 가입 방법입니다. 다른 가입 방법을 이용해 주세요.",
    resultCode: HttpResultCode.FAIL,
    statusCode: HttpStatus.UNAUTHORIZED,
    example: {
      ["지원하지 않는 가입 방법"]: {
        value: {
          statusCode: HttpStatus.UNAUTHORIZED,
          resultCode: HttpResultCode.FAIL,
          error: {
            error: HttpErrorNameEnum.UnauthorizedException,
            message:
              "지원하지 않는 가입 방법입니다. 다른 가입 방법을 이용해 주세요.",
          },
        },
      },
    },
  },
  notFoundUser: {
    exampleDescription: "사용자를 찾을 수 없는 경우 발생하는 에러",
    message: "사용자를 찾을 수 없습니다.",
    resultCode: HttpResultCode.NOT_EXIST_USER,
    statusCode: HttpStatus.NOT_FOUND,
    example: {
      ["사용자를 찾을 수 없음"]: {
        value: {
          statusCode: HttpStatus.NOT_FOUND,
          resultCode: HttpResultCode.NOT_EXIST_USER,
          error: {
            error: HttpErrorNameEnum.NotFoundException,
            message: "사용자를 찾을 수 없습니다.",
          },
        },
      },
    },
  },
  incorrectPassword: {
    exampleDescription: "비밀번호가 일치하지 않는 경우 발생하는 에러",
    message: "비밀번호가 일치하지 않습니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.INCORRECT_PASSWORD,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["비밀번호 불일치"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INCORRECT_PASSWORD,
          error: {
            error: HttpErrorNameEnum.BadRequestException,
            message: "비밀번호가 일치하지 않습니다. 다시 시도해 주세요.",
          },
        },
      },
    },
  },
  suspensionUser: {
    exampleDescription: "정지된 계정",
    message: "정지된 계정입니다. 관리자에게 문의해 주세요.",
    resultCode: HttpResultCode.SUSPENDED_ACCOUNT,
    statusCode: HttpStatus.FORBIDDEN,
    example: {
      ["정지된 계정"]: {
        value: {
          statusCode: HttpStatus.FORBIDDEN,
          resultCode: HttpResultCode.SUSPENDED_ACCOUNT,
          error: {
            error: HttpErrorNameEnum.ForbiddenException,
            message: "정지된 계정입니다. 관리자에게 문의해 주세요.",
          },
        },
      },
    },
  },
  unsupportedGrantType: {
    exampleDescription: "지원하지 않는 인증 방식",
    message: "지원하지 않는 인증 방식입니다. 다른 방식을 이용해 주세요.",
    resultCode: HttpResultCode.FAIL,
    statusCode: HttpStatus.UNAUTHORIZED,
    example: {
      ["지원하지 않는 인증 방식"]: {
        value: {
          statusCode: HttpStatus.UNAUTHORIZED,
          resultCode: HttpResultCode.FAIL,
          error: {
            error: HttpErrorNameEnum.UnauthorizedException,
            message:
              "지원하지 않는 인증 방식입니다. 다른 방식을 이용해 주세요.",
          },
        },
      },
    },
  },
  tokenValidation: {
    exampleDescription: "토큰 검증 오류",
    message: "토큰 검증 오류",
    resultCode: HttpResultCode.INVALID_REQUEST,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["토큰 검증 오류"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INVALID_REQUEST,
          error: {
            error: "ValidationError",
            message: "토큰 검증 오류",
            validationErrorInfo: {
              token: ["토큰이 필요합니다."],
            },
          },
        },
      },
    },
  },
  expiredToken: {
    exampleDescription: "만료된 토큰",
    message: "만료된 토큰입니다. 다시 로그인 해주세요.",
    resultCode: HttpResultCode.EXPIRED_TOKEN,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["만료된 토큰"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.EXPIRED_TOKEN,
          error: {
            error: HttpErrorNameEnum.BadRequestException,
            message: "만료된 토큰입니다. 다시 로그인 해주세요.",
          },
        },
      },
    },
  },
  invalidToken: {
    exampleDescription: "유효하지 않은 토큰",
    message: "유효하지 않은 토큰입니다. 다시 로그인 해주세요.",
    resultCode: HttpResultCode.INVALID_TOKEN,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["유효하지 않은 토큰"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INVALID_TOKEN,
          error: {
            error: HttpErrorNameEnum.BadRequestException,
            message: "유효하지 않은 토큰입니다. 다시 로그인 해주세요.",
          },
        },
      },
    },
  },
  refreshTokenAlreadyUsed: {
    exampleDescription: "리프레시 토큰이 이미 사용된 경우 발생하는 에러",
    message: "리프레시 토큰이 이미 사용되었습니다.  다시 로그인 해주세요.",
    resultCode: HttpResultCode.INVALID_TOKEN,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["리프레시 토큰 사용됨"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INVALID_TOKEN,
          error: {
            error: HttpErrorNameEnum.BadRequestException,
            message:
              "리프레시 토큰이 이미 사용되었습니다.  다시 로그인 해주세요.",
          },
        },
      },
    },
  },
  invalidAuthorizationHeader: {
    exampleDescription: "잘못된 헤더 형식으로 요청보냈을때 발생하는 에러",
    message: "잘못된 헤더 형식",
    resultCode: HttpResultCode.FAIL,
    statusCode: HttpStatus.UNAUTHORIZED,
    example: {
      ["잘못된 헤더 형식"]: {
        value: {
          statusCode: HttpStatus.UNAUTHORIZED,
          resultCode: HttpResultCode.FAIL,
          error: {
            error: HttpErrorNameEnum.UnauthorizedException,
            message: "잘못된 헤더 형식입니다. 다시 시도해 주세요.",
          },
        },
      },
    },
  },
  notLogin: {
    exampleDescription: "로그인하지 않은 사용자",
    message: "로그인하지 않은 사용자입니다. 로그인 후 이용해 주세요.",
    resultCode: HttpResultCode.UNAUTHORIZED,
    statusCode: HttpStatus.UNAUTHORIZED,
    example: {
      ["로그인하지 않은 사용자"]: {
        value: {
          statusCode: HttpStatus.UNAUTHORIZED,
          resultCode: HttpResultCode.UNAUTHORIZED,
          error: {
            error: HttpErrorNameEnum.ForbiddenException,
            message: "로그인하지 않은 사용자입니다. 로그인 후 이용해 주세요.",
          },
        },
      },
    },
  },
  tooManyTokenRefreshRequests: {
    exampleDescription: "리프레시 토큰 재발급 요청 횟수 초과",
    message:
      "리프레시 토큰 재발급 요청 횟수가 초과되었습니다. 다시 로그인 해주세요.",
    resultCode: HttpResultCode.TOO_MANY_REQUESTS,
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    example: {
      ["리프레시 토큰 재발급 요청 횟수 초과"]: {
        value: {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          resultCode: HttpResultCode.TOO_MANY_REQUESTS,
          error: {
            error: HttpErrorNameEnum.ThrottlerException,
            message:
              "리프레시 토큰 재 발급 요청 횟수가 초과되었습니다. 다시 로그인 해주세요.",
          },
        },
      },
    },
  },
};

export const OpenApiAuthSuccessDefine = {
  auth: {
    exampleDescription: "인증에 성공한 경우 발생하는 응답",
    message: "인증에 성공했습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: {
            token: "",
            tokenType: "Bearer",
            expiresAt: "2022-01-01T00:00:00.000Z",
            expiresIn: "30m",
            refreshToken: "",
            user: {
              id: "",
              email: "",
              username: "",
              emailConfirmedAt: "2022-01-01T00:00:00.000Z",
              isSuspended: false,
              deletedAt: null,
              Role: {
                symbol: "",
              },
              UserProfile: {
                image: "",
              },
            },
          },
        },
      },
    },
  },
  logout: {
    exampleDescription: "로그아웃에 성공한 경우 발생하는 응답",
    message: "로그아웃에 성공했습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.NO_CONTENT,
    example: {
      ["로그아웃 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: true,
        },
      },
    },
  },
};

export const OpenApiAuthBadRequestErrorDefine = {
  signUp: {
    status: HttpStatus.BAD_REQUEST,
    content: {
      "application/json": {
        schema: {
          oneOf: [
            {
              $ref: getSchemaPath(HttpErrorDto),
            },
            { $ref: getSchemaPath(ValidationErrorDto) },
          ],
        },
        examples: {
          ...OpenApiAuthErrorDefine.emailAlreadyExists.example,
          ...OpenApiAuthErrorDefine.signupValidation.example,
        },
      },
    },
  } as ApiResponseOptions,
  signIn: {
    status: HttpStatus.BAD_REQUEST,
    content: {
      "application/json": {
        schema: {
          oneOf: [
            {
              $ref: getSchemaPath(HttpErrorDto),
            },
            { $ref: getSchemaPath(ValidationErrorDto) },
          ],
        },
        examples: {
          ...OpenApiAuthErrorDefine.signinValidation.example,
          ...OpenApiAuthErrorDefine.incorrectPassword.example,
        },
      },
    },
  } as ApiResponseOptions,
  token: {
    status: HttpStatus.BAD_REQUEST,
    content: {
      "application/json": {
        schema: {
          oneOf: [
            {
              $ref: getSchemaPath(HttpErrorDto),
            },
            { $ref: getSchemaPath(ValidationErrorDto) },
          ],
        },
        examples: {
          ...OpenApiAuthErrorDefine.tokenValidation.example,
          ...OpenApiAuthErrorDefine.expiredToken.example,
          ...OpenApiAuthErrorDefine.invalidToken.example,
          ...OpenApiAuthErrorDefine.refreshTokenAlreadyUsed.example,
        },
      },
    },
  } as ApiResponseOptions,
  invalidToken: {
    status: HttpStatus.BAD_REQUEST,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: OpenApiAuthErrorDefine.invalidToken.example,
      },
    },
  } as ApiResponseOptions,
};

export const OpenApiAuthNotFoundErrorDefine = {
  roleNotFound: {
    status: HttpStatus.NOT_FOUND,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: OpenApiAuthErrorDefine.roleNotFound.example,
      },
    },
  } as ApiResponseOptions,
  notFoundUser: {
    status: HttpStatus.NOT_FOUND,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: OpenApiAuthErrorDefine.notFoundUser.example,
      },
    },
  } as ApiResponseOptions,
};

export const OpenApiAuthUnauthorizedErrorDefine = {
  unsupportedAuthMethod: {
    status: HttpStatus.UNAUTHORIZED,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: OpenApiAuthErrorDefine.unsupportedAuthMethod.example,
      },
    },
  } as ApiResponseOptions,
  unsupportedGrantType: {
    status: HttpStatus.UNAUTHORIZED,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: OpenApiAuthErrorDefine.unsupportedGrantType.example,
      },
    },
  } as ApiResponseOptions,
  logout: {
    status: HttpStatus.UNAUTHORIZED,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: {
          ...OpenApiAuthErrorDefine.invalidAuthorizationHeader.example,
          ...OpenApiAuthErrorDefine.notLogin.example,
        },
      },
    },
  } as ApiResponseOptions,
};

export const OpenApiAuthForbiddenErrorDefine = {
  suspensionUser: {
    status: HttpStatus.FORBIDDEN,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: OpenApiAuthErrorDefine.suspensionUser.example,
      },
    },
  } as ApiResponseOptions,
};

export const OpenApiAuthConflictErrorDefine = {
  tooManyTokenRefreshRequests: {
    status: HttpStatus.TOO_MANY_REQUESTS,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: OpenApiAuthErrorDefine.tooManyTokenRefreshRequests.example,
      },
    },
  } as ApiResponseOptions,
};

export const OpenApiAuthSuccessResponseDefine = {
  auth: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(AuthResponseDto),
        },
        examples: OpenApiAuthSuccessDefine.auth.example,
      },
    },
  } as ApiResponseOptions,
  logout: {
    status: HttpStatus.NO_CONTENT,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(LogoutResponseDto),
        },
        examples: OpenApiAuthSuccessDefine.logout.example,
      },
    },
  },
};
