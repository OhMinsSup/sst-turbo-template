import { HttpResultCode } from "@template/common";

import { AuthEntity } from "../../../../routes/auth/entities/auth.entity";

export class AuthTokenResponseDto extends AuthEntity {}

export const AuthSuccessDefine = {
  signup: {
    model: AuthTokenResponseDto,
    exampleDescription: "이메일 회원가입에 성공한 경우 발생하는 응답",
    exampleTitle: "이메일 회원가입 성공",
    resultCode: HttpResultCode.OK,
  },
  signin: {
    model: AuthTokenResponseDto,
    exampleDescription: "이메일 로그인에 성공한 경우 발생하는 응답",
    exampleTitle: "이메일 로그인 성공",
    resultCode: HttpResultCode.OK,
  },
  "token+refresh_token": {
    model: AuthTokenResponseDto,
    exampleDescription: "토큰 재발급에 성공한 경우 발생하는 응답",
    exampleTitle: "토큰 재발급 성공",
    resultCode: HttpResultCode.OK,
  },
  logout: {
    model: Boolean,
    exampleDescription: "로그아웃에 성공한 경우 발생하는 응답",
    exampleTitle: "로그아웃 성공",
    resultCode: HttpResultCode.OK,
  },
};
