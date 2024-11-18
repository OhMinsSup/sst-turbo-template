import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { CustomValidationError } from "src/shared/dtos/response/validation-exception-response.dto";

import { HttpResultCode } from "@template/common";

import type { ErrorResponseOption } from "../../../decorators/error-response.decorator";

export const AuthValidationErrorCode = "Auth-0000";
export const AuthAlreadyExistEmailErrorCode = "Auth-0001";
export const AuthNotExistEmailErrorCode = "Auth-0002";
export const AuthIncorrectPasswordErrorCode = "Auth-0003";
export const AuthNotExistUserErrorCode = "Auth-0004";
export const AuthSigninValidationErrorCode = "Auth-0005";
export const AuthAccessTokenValidationErrorCode = "Auth-0006";
export const AuthRefreshTokenValidationErrorCode = "Auth-0007";
export const AuthTokenExpiredErrorCode = "Auth-0008";
export const AuthVerificationTokenValidationErrorCode = "Auth-0009";
export const AuthTokenInvalidErrorCode = "Auth-0010";
export const AuthTokenNotExistErrorCode = "Auth-0011";
export const AuthNotLoginErrorCode = "Auth-0012";
export const AuthUserSuspensionErrorCode = "Auth-0013";
export const AuthUnsupportedSignupMethodErrorCode = "Auth-0014";

type Keys =
  | typeof AuthAlreadyExistEmailErrorCode
  | typeof AuthValidationErrorCode
  | typeof AuthNotExistEmailErrorCode
  | typeof AuthIncorrectPasswordErrorCode
  | typeof AuthNotExistUserErrorCode
  | typeof AuthSigninValidationErrorCode
  | typeof AuthAccessTokenValidationErrorCode
  | typeof AuthRefreshTokenValidationErrorCode
  | typeof AuthTokenExpiredErrorCode
  | typeof AuthVerificationTokenValidationErrorCode
  | typeof AuthTokenInvalidErrorCode
  | typeof AuthTokenNotExistErrorCode
  | typeof AuthNotLoginErrorCode
  | typeof AuthUserSuspensionErrorCode
  | typeof AuthUnsupportedSignupMethodErrorCode;

export const AuthErrorDefine: Record<Keys, ErrorResponseOption> = {
  [AuthValidationErrorCode]: {
    model: CustomValidationError,
    exampleDescription: "요청 데이터 검증 오류",
    exampleTitle: "검증 오류",
    message: {
      email: ["잘못된 이메일 형식입니다."],
      name: ["이름은 문자열이어야 합니다.", "이름은 50자 이하여야 합니다."],
      password: [
        "비밀번호는 문자열이어야 합니다.",
        "비밀번호는 6자 이상이어야 합니다.",
        "비밀번호는 100자 이하여야 합니다.",
      ],
      image: [
        "사용자의 이미지 URL은 문자열이어야 합니다.",
        "잘못된 이미지 URL 형식입니다.",
      ],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
  },
  [AuthSigninValidationErrorCode]: {
    model: CustomValidationError,
    exampleDescription: "요청 데이터 검증 오류",
    exampleTitle: "검증 오류",
    message: {
      email: ["잘못된 이메일 형식입니다."],
      password: [
        "비밀번호는 문자열이어야 합니다.",
        "비밀번호는 6자 이상이어야 합니다.",
        "비밀번호는 100자 이하여야 합니다.",
      ],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
  },
  [AuthAccessTokenValidationErrorCode]: {
    model: CustomValidationError,
    exampleDescription: "요청 데이터 검증 오류",
    exampleTitle: "검증 오류",
    message: {
      accessToken: ["잘못된 토큰 형식입니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
  },
  [AuthRefreshTokenValidationErrorCode]: {
    model: CustomValidationError,
    exampleDescription: "요청 데이터 검증 오류",
    exampleTitle: "검증 오류",
    message: {
      refreshToken: ["잘못된 토큰 형식입니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
  },
  [AuthVerificationTokenValidationErrorCode]: {
    model: CustomValidationError,
    exampleDescription: "요청 데이터 검증 오류",
    exampleTitle: "검증 오류",
    message: {
      token: ["잘못된 토큰 형식입니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
  },
  [AuthAlreadyExistEmailErrorCode]: {
    model: BadRequestException,
    exampleDescription: "이미 가입된 이메일인 경우 발생하는 에러",
    exampleTitle: "이메일 중복",
    message: "이미 가입된 이메일입니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.NOT_EXIST_EMAIL,
  },
  [AuthNotExistEmailErrorCode]: {
    model: BadRequestException,
    exampleDescription: "가입되지 않은 이메일인 경우 발생하는 에러",
    exampleTitle: "이메일 없음",
    message: "가입되지 않은 이메일입니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.ALREADY_EXIST_EMAIL,
  },
  [AuthIncorrectPasswordErrorCode]: {
    model: BadRequestException,
    exampleDescription: "비밀번호가 일치하지 않는 경우 발생하는 에러",
    exampleTitle: "비밀번호 불일치",
    message: "비밀번호가 일치하지 않습니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.INCORRECT_PASSWORD,
  },
  [AuthNotExistUserErrorCode]: {
    model: BadRequestException,
    exampleDescription: "가입되지 않은 유저인 경우 발생하는 에러",
    exampleTitle: "유저 없음",
    message: "가입되지 않은 유저입니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.NOT_EXIST_USER,
  },
  [AuthTokenExpiredErrorCode]: {
    model: UnauthorizedException,
    exampleDescription: "토큰 만료",
    exampleTitle: "토큰 만료",
    message: "토큰이 만료되었습니다. 다시 인증해 주세요.",
    resultCode: HttpResultCode.EXPIRED_TOKEN,
  },
  [AuthTokenInvalidErrorCode]: {
    model: UnauthorizedException,
    exampleDescription: "유효하지 않은 토큰",
    exampleTitle: "유효하지 않은 토큰",
    message: "유효하지 않은 토큰입니다. 다시 인증해 주세요.",
    resultCode: HttpResultCode.INVALID_TOKEN,
  },
  [AuthTokenNotExistErrorCode]: {
    model: UnauthorizedException,
    exampleDescription: "토큰이 존재하지 않음",
    exampleTitle: "토큰 없음",
    message: "토큰이 존재하지 않습니다. 다시 인증해 주세요.",
    resultCode: HttpResultCode.NOT_EXIST_TOKEN,
  },
  [AuthNotLoginErrorCode]: {
    model: UnauthorizedException,
    exampleDescription: "로그인하지 않은 사용자",
    exampleTitle: "로그인하지 않은 사용자",
    message: "로그인하지 않은 사용자입니다. 로그인 후 이용해 주세요.",
    resultCode: HttpResultCode.UNAUTHORIZED,
  },
  [AuthUserSuspensionErrorCode]: {
    model: UnauthorizedException,
    exampleDescription: "정지된 계정",
    exampleTitle: "정지된 계정",
    message: "정지된 계정입니다. 관리자에게 문의해 주세요.",
    resultCode: HttpResultCode.SUSPENDED_ACCOUNT,
  },
  [AuthUnsupportedSignupMethodErrorCode]: {
    model: UnauthorizedException,
    exampleDescription: "지원하지 않는 가입 방법",
    exampleTitle: "지원하지 않는 가입 방법",
    message: "지원하지 않는 가입 방법입니다. 다른 가입 방법을 이용해 주세요.",
    resultCode: HttpResultCode.FAIL,
  },
};
