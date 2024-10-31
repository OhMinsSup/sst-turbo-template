import { NotFoundException } from "@nestjs/common";

import { HttpResultCode } from "@template/common";

import { ErrorResponseOption } from "../../../decorators/error-response.decorator";

export const UserNotExistErrorCode = "User-0000";

type Keys = typeof UserNotExistErrorCode;

export const UserErrorDefine: Record<Keys, ErrorResponseOption> = {
  [UserNotExistErrorCode]: {
    model: NotFoundException,
    exampleDescription: "사용자가 존재하지 않음",
    exampleTitle: "사용자 없음",
    message: "사용자가 존재하지 않습니다.",
    resultCode: HttpResultCode.NOT_EXIST_USER,
  },
};
