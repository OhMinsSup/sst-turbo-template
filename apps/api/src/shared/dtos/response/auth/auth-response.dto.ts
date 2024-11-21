import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { HttpResultCode } from "@template/common";

import { UserResponseDto } from "../users/user-response.dto";

export class AuthTokenResponseDto {
  @ApiProperty({
    description: "토큰",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    type: String,
    required: true,
  })
  @Expose()
  readonly token: string;

  @ApiProperty({
    description: "토큰타입",
    example: "Bearer",
    type: String,
    required: true,
  })
  @Expose()
  readonly tokenType: string;

  @ApiProperty({
    description: "만료시간",
    example: "30m",
    type: String,
    required: true,
  })
  @Expose()
  readonly expiresIn: string;

  @ApiProperty({
    description: "만료일",
    type: Date,
    required: true,
    format: "date-time",
  })
  @Expose()
  readonly expiresAt: Date;

  @ApiProperty({ description: "Refresh 토큰", type: String })
  @Expose()
  readonly refreshToken: string;

  @ApiProperty({
    description: "세션 유저 정보",
    type: UserResponseDto,
  })
  @Type(() => UserResponseDto)
  @Expose()
  readonly user: UserResponseDto;
}

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
