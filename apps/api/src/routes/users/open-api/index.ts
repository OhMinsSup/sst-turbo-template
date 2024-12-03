import type { ApiResponseOptions } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";
import { UserResponseDto } from "src/shared/dtos/response/users/user-response.dto";

import { HttpResultCode } from "@template/common";

export const OpenApiSuccessDefine = {
  me: {
    exampleDescription: "로그인 사용자 정보",
    message: "사용자 정보를 성공적으로 가져왔습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
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

export const OpenApiSuccessResponseDefine = {
  me: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(UserResponseDto),
        },
        examples: OpenApiSuccessDefine.me.example,
      },
    },
  } as ApiResponseOptions,
};
