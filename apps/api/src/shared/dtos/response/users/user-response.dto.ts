import { HttpResultCode } from "@template/common";

import { UserEntity } from "../../../../routes/users/entities/user.entity";

export class UserResponseDto extends UserEntity {}

export const UserSuccessDefine = {
  me: {
    model: UserResponseDto,
    exampleDescription: "유저 정보를 가져오는데 성공한 경우 발생하는 응답",
    exampleTitle: "유저 정보 가져오기 성공",
    resultCode: HttpResultCode.OK,
  },
};
