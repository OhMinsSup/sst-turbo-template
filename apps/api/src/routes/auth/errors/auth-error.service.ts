import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { HttpResultCode } from "@template/common";

import type { ErrorResponseOption } from "../../../decorators/error-response.decorator";
import { CustomValidationError } from "../../../shared/dtos/response/validation-exception-response.dto";

export const AuthErrorDefine = {
  emailAlreadyExists: {
    model: BadRequestException,
    exampleDescription: "이미 가입된 이메일인 경우 발생하는 에러",
    exampleTitle: "이메일 중복",
    message: "이미 가입된 이메일입니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.NOT_EXIST_EMAIL,
  },
  roleNotFound: {
    model: NotFoundException,
    exampleDescription: "Role이 없는 경우 발생하는 에러",
    exampleTitle: "Role 없음",
    message: "잘못된 요청입니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.FAIL,
  },
  unsupportedSignupMethod: {
    model: UnauthorizedException,
    exampleDescription: "지원하지 않는 가입 방법",
    exampleTitle: "지원하지 않는 가입 방법",
    message: "지원하지 않는 가입 방법입니다. 다른 가입 방법을 이용해 주세요.",
    resultCode: HttpResultCode.FAIL,
  },
  unsupportedGrantType: {
    model: UnauthorizedException,
    exampleDescription: "지원하지 않는 인증 방식",
    exampleTitle: "지원하지 않는 인증 방식",
    message: "지원하지 않는 인증 방식입니다. 다른 인증 방식을 이용해 주세요.",
    resultCode: HttpResultCode.FAIL,
  },
  signupValidation: {
    model: CustomValidationError,
    exampleDescription: "요청 데이터 검증 오류",
    exampleTitle: "검증 오류",
    message: {
      email: ["잘못된 이메일 형식입니다."],
      username: ["이름은 문자열이어야 합니다.", "이름은 50자 이하여야 합니다."],
      password: [
        "비밀번호는 문자열이어야 합니다.",
        "비밀번호는 6자 이상이어야 합니다.",
        "비밀번호는 100자 이하여야 합니다.",
      ],
      provider: ["잘못된 인증 방식입니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
  },
  signinValidation: {
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
      provider: ["잘못된 인증 방식입니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
  },
  notLogin: {
    model: ForbiddenException,
    exampleDescription: "로그인하지 않은 사용자",
    exampleTitle: "로그인하지 않은 사용자",
    message: "로그인하지 않은 사용자입니다. 로그인 후 이용해 주세요.",
    resultCode: HttpResultCode.UNAUTHORIZED,
  },
  suspensionUser: {
    model: ForbiddenException,
    exampleDescription: "정지된 계정",
    exampleTitle: "정지된 계정",
    message: "정지된 계정입니다. 관리자에게 문의해 주세요.",
    resultCode: HttpResultCode.SUSPENDED_ACCOUNT,
  },
  invalidToken: {
    model: BadRequestException,
    exampleDescription: "유효하지 않은 토큰",
    exampleTitle: "유효하지 않은 토큰",
    message: "유효하지 않은 토큰입니다. 다시 인증해 주세요.",
    resultCode: HttpResultCode.INVALID_TOKEN,
  },
  notFoundUser: {
    model: NotFoundException,
    exampleDescription: "가입되지 않은 유저인 경우 발생하는 에러",
    exampleTitle: "유저 없음",
    message: "가입되지 않은 유저입니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.NOT_EXIST_USER,
  },
  invalidAuthorizationHeader: {
    model: UnauthorizedException,
    exampleDescription: "잘못된 헤더 형식으로 요청보냈을때 발생하는 에러",
    exampleTitle: "잘못된 헤더 형식",
    message: "잘못된 헤더 형식입니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.FAIL,
  },
  incorrectPassword: {
    model: BadRequestException,
    exampleDescription: "비밀번호가 일치하지 않는 경우 발생하는 에러",
    exampleTitle: "비밀번호 불일치",
    message: "비밀번호가 일치하지 않습니다. 다시 시도해 주세요.",
    resultCode: HttpResultCode.INCORRECT_PASSWORD,
  },
  expiredToken: {
    model: BadRequestException,
    exampleDescription: "만료된 토큰",
    exampleTitle: "만료된 토큰",
    message: "만료된 토큰입니다. 다시 인증해 주세요.",
    resultCode: HttpResultCode.EXPIRED_TOKEN,
  },
};

@Injectable()
export class AuthErrorService {
  /**
   * @description 이미 가입된 이메일인 경우 발생하는 에러
   * @returns {ErrorResponseOption}
   */
  emailAlreadyExists(): ErrorResponseOption {
    return AuthErrorDefine.emailAlreadyExists;
  }

  /**
   * @description role이 없는 경우 발생하는 에러
   * @returns {ErrorResponseOption}
   */
  roleNotFound(): ErrorResponseOption {
    return AuthErrorDefine.roleNotFound;
  }

  /**
   * @description 지원하지 않는 가입 방법
   * @returns {ErrorResponseOption}
   */
  unsupportedAuthMethod(): ErrorResponseOption {
    return AuthErrorDefine.unsupportedSignupMethod;
  }

  /**
   * @description 요청 데이터 검증 오류
   * @returns {ErrorResponseOption}
   */
  signupValidation(): ErrorResponseOption {
    return AuthErrorDefine.signupValidation;
  }

  /**
   * @description 로그인하지 않은 사용자
   * @returns {ErrorResponseOption}
   */
  notLogin(): ErrorResponseOption {
    return AuthErrorDefine.notLogin;
  }

  /**
   * @description 정지된 계정
   * @returns {ErrorResponseOption}
   * */
  suspensionUser(): ErrorResponseOption {
    return AuthErrorDefine.suspensionUser;
  }

  /**
   * @description 유효하지 않은 토큰
   * @returns {ErrorResponseOption}
   */
  invalidToken(): ErrorResponseOption {
    return AuthErrorDefine.invalidToken;
  }

  /**
   * @description 가입되지 않은 유저인 경우 발생하는 에러
   * @returns {ErrorResponseOption}
   */
  notFoundUser(): ErrorResponseOption {
    return AuthErrorDefine.notFoundUser;
  }

  /**
   * @description 잘못된 헤더 형식으로 요청보냈을때 발생하는 에러
   * @returns {ErrorResponseOption}
   */
  invalidAuthorizationHeader(): ErrorResponseOption {
    return AuthErrorDefine.invalidAuthorizationHeader;
  }

  /**
   * @description 비밀번호가 일치하지 않는 경우 발생하는 에러
   * @returns {ErrorResponseOption}
   */
  incorrectPassword(): ErrorResponseOption {
    return AuthErrorDefine.incorrectPassword;
  }

  /**
   * @description 지원하지 않는 인증 방식
   * @returns {ErrorResponseOption}
   */
  unsupportedGrantType(): ErrorResponseOption {
    return AuthErrorDefine.unsupportedGrantType;
  }

  /**
   * @description 만료된 토큰
   * @returns {ErrorResponseOption}
   */
  expiredToken(): ErrorResponseOption {
    return AuthErrorDefine.expiredToken;
  }
}
