import { NotFoundException } from "@nestjs/common";

import { HttpResultCode } from "@template/common";

export const UserNotExistErrorCode = "User-0000";

type Keys = typeof UserNotExistErrorCode;

export const UserErrorDefine = {
  [UserNotExistErrorCode]: {
    model: NotFoundException,
    exampleDescription: "사용자가 존재하지 않음",
    exampleTitle: "사용자 없음",
    message: "사용자가 존재하지 않습니다.",
    resultCode: HttpResultCode.NOT_EXIST_USER,
  },
};
