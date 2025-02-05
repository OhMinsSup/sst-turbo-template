import type { ApiResponseOptions } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";
import { HttpResultCodeEnum } from "@veloss/constants/http";

import { OpenApiAuthErrorDefine } from "../../../routes/auth/open-api";
import { HttpErrorDto } from "../../../shared/dtos/models/http-error.dto";
import { ValidationErrorDto } from "../../../shared/dtos/models/validation-error.dto";
import { UserResponseDto } from "../../../shared/dtos/response/users/user-response.dto";

export const OpenApiUserErrorDefine = {
  updateValidation: {
    exampleDescription: "요청 데이터 검증 오류",
    message: "요청 데이터 검증 오류",
    resultCode: HttpResultCodeEnum.INVALID_REQUEST,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["검증 오류"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCodeEnum.INVALID_REQUEST,
          error: {
            error: "ValidationError",
            message: "요청 데이터 검증 오류",
            validationErrorInfo: {
              username: [
                "이름은 문자열이어야 합니다.",
                "이름은 50자 이하여야 합니다.",
              ],
              image: ["이미지 URL 형식이 아닙니다."],
            },
          },
        },
      },
    },
  },
};

export const OpenApiUserBadRequestErrorDefine = {
  update: {
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
          ...OpenApiUserErrorDefine.updateValidation.example,
        },
      },
    },
  } as ApiResponseOptions,
};

export const OpenApiUserSuccessDefine = {
  me: {
    exampleDescription: "로그인 사용자 정보",
    message: "사용자 정보를 성공적으로 가져왔습니다.",
    resultCode: HttpResultCodeEnum.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCodeEnum.OK,
          data: {
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
};

export const OpenApiUserSuccessResponseDefine = {
  me: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(UserResponseDto),
        },
        examples: OpenApiUserSuccessDefine.me.example,
      },
    },
  } as ApiResponseOptions,
};
