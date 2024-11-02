import { Body, Controller, HttpStatus, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

import { HttpResultCode } from "@template/common";

import { ErrorResponse } from "../../../decorators/error-response.decorator";
import { SuccessResponse } from "../../../decorators/success-response.decorator";
import { AuthResponseDto } from "../../../shared/dtos/response/auth/auth-response.dto";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { SigninDTO } from "../dto/signin.dto";
import { SignoutDTO } from "../dto/signout.dto";
import { SignupDTO } from "../dto/signup.dto";
import { VerifyTokenDTO } from "../dto/verify-token.dto";
import {
  AuthAccessTokenValidationErrorCode,
  AuthAlreadyExistEmailErrorCode,
  AuthErrorDefine,
  AuthIncorrectPasswordErrorCode,
  AuthNotExistEmailErrorCode,
  AuthNotExistUserErrorCode,
  AuthRefreshTokenValidationErrorCode,
  AuthSigninValidationErrorCode,
  AuthTokenInvalidErrorCode,
  AuthTokenNotExistErrorCode,
  AuthValidationErrorCode,
  AuthVerificationTokenValidationErrorCode,
} from "../errors";
import { AuthService } from "../services/auth.service";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signup")
  @ApiOperation({ summary: "이메일 회원가입" })
  @ApiBody({
    required: true,
    description: "회원가입 API",
    type: SignupDTO,
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: AuthResponseDto,
      exampleDescription: "이메일 회원가입에 성공한 경우 발생하는 응답",
      exampleTitle: "이메일 회원가입 성공",
      resultCode: HttpResultCode.OK,
    },
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine[AuthAlreadyExistEmailErrorCode],
    AuthErrorDefine[AuthValidationErrorCode],
  ])
  async signup(@Body() body: SignupDTO) {
    return await this.service.signup(body);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signin")
  @ApiOperation({ summary: "이메일 로그인" })
  @ApiBody({
    required: true,
    description: "로그인 API",
    type: SigninDTO,
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: AuthResponseDto,
      exampleDescription: "이메일 로그인에 성공한 경우 발생하는 응답",
      exampleTitle: "이메일 로그인 성공",
      resultCode: HttpResultCode.OK,
    },
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine[AuthSigninValidationErrorCode],
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    AuthErrorDefine[AuthNotExistEmailErrorCode],
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine[AuthIncorrectPasswordErrorCode],
  ])
  async signin(@Body() body: SigninDTO) {
    return await this.service.signin(body);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signout")
  @ApiOperation({ summary: "로그아웃" })
  @ApiBody({
    required: true,
    description: "로그아웃 API",
    type: SignoutDTO,
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: Boolean,
      exampleDescription: "로그아웃에 성공한 경우 발생하는 응답",
      exampleTitle: "로그아웃 성공",
      resultCode: HttpResultCode.OK,
    },
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine[AuthAccessTokenValidationErrorCode],
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    AuthErrorDefine[AuthNotExistUserErrorCode],
    AuthErrorDefine[AuthTokenNotExistErrorCode],
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine[AuthTokenInvalidErrorCode],
  ])
  async signout(@Body() body: SignoutDTO) {
    return await this.service.signout(body);
  }

  @SkipThrottle()
  @Post("verify")
  @ApiOperation({ summary: "토큰 검증" })
  @ApiBody({
    required: true,
    description: "토큰 검증 API",
    type: VerifyTokenDTO,
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: Boolean,
      exampleDescription: "토큰 검증에 성공한 경우 발생하는 응답",
      exampleTitle: "토큰 검증 성공",
      resultCode: HttpResultCode.OK,
    },
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine[AuthVerificationTokenValidationErrorCode],
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    AuthErrorDefine[AuthNotExistUserErrorCode],
    AuthErrorDefine[AuthTokenNotExistErrorCode],
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine[AuthTokenInvalidErrorCode],
  ])
  async verifyToken(@Body() body: VerifyTokenDTO) {
    return await this.service.verifyToken(body);
  }

  @SkipThrottle()
  @Patch("refresh")
  @ApiOperation({ summary: "토큰 갱신" })
  @ApiBody({
    required: true,
    description: "토큰 갱신 API",
    type: RefreshTokenDTO,
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: AuthResponseDto,
      exampleDescription: "토큰 갱신에 성공한 경우 발생하는 응답",
      exampleTitle: "토큰 갱신 성공",
      resultCode: HttpResultCode.OK,
    },
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine[AuthRefreshTokenValidationErrorCode],
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    AuthErrorDefine[AuthNotExistUserErrorCode],
    AuthErrorDefine[AuthTokenNotExistErrorCode],
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine[AuthTokenInvalidErrorCode],
  ])
  async refresh(@Body() body: RefreshTokenDTO) {
    return await this.service.refresh(body);
  }
}
