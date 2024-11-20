import { Body, Controller, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { AuthUser } from "src/decorators/auth-user.decorator";

import type { UserExternalPayload } from "@template/db/selectors";

import { ErrorResponse } from "../../../decorators/error-response.decorator";
import { SuccessResponse } from "../../../decorators/success-response.decorator";
import { JwtAuth } from "../../../guards/jwt-auth.guard";
import { AuthSuccessDefine } from "../../../shared/dtos/response/auth/auth-response.dto";
import { SignInDTO } from "../dto/signin.dto";
import { SignUpDTO } from "../dto/signup.dto";
import { TokenQueryDTO } from "../dto/token-query.dto";
import { TokenDTO } from "../dto/token.dto";
import { AuthErrorDefine } from "../errors";
import { AuthService } from "../services/auth.service";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signUp")
  @ApiOperation({ summary: "이메일 회원가입" })
  @ApiBody({
    required: true,
    description: "회원가입 API",
    type: SignUpDTO,
  })
  @SuccessResponse(HttpStatus.OK, [AuthSuccessDefine.signup])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine.emailAlreadyExists,
    AuthErrorDefine.signupValidation,
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine.unsupportedAuthMethod,
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [AuthErrorDefine.roleNotFound])
  async signUp(@Body() body: SignUpDTO) {
    return await this.service.signUp(body);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signIn")
  @ApiOperation({ summary: "이메일 회원가입" })
  @ApiBody({
    required: true,
    description: "로그인 API",
    type: SignInDTO,
  })
  @ErrorResponse(HttpStatus.NOT_FOUND, [AuthErrorDefine.notFoundUser])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine.incorrectPassword,
    AuthErrorDefine.signinValidation,
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine.unsupportedAuthMethod,
  ])
  @SuccessResponse(HttpStatus.OK, [AuthSuccessDefine.signin])
  async signIn(@Body() body: SignInDTO) {
    return await this.service.signIn(body);
  }

  @SkipThrottle()
  @Post("token")
  @ApiOperation({ summary: "토큰 재발급" })
  @ApiBody({
    required: true,
    description: "토큰 재발급 API",
    type: TokenDTO,
  })
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine.tokenValidation,
    AuthErrorDefine.expiredToken,
    AuthErrorDefine.invalidToken,
    AuthErrorDefine.refreshTokenAlreadyUsed,
  ])
  @ErrorResponse(HttpStatus.FORBIDDEN, [AuthErrorDefine.suspensionUser])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine.unsupportedGrantType,
  ])
  @SuccessResponse(HttpStatus.OK, [AuthSuccessDefine["token+refresh_token"]])
  async token(@Body() body: TokenDTO, @Query() query: TokenQueryDTO) {
    return await this.service.token(body, query);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("logout")
  @ApiOperation({ summary: "로그아웃" })
  @JwtAuth()
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine.invalidAuthorizationHeader,
    AuthErrorDefine.notLogin,
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [AuthErrorDefine.invalidToken])
  @ErrorResponse(HttpStatus.NOT_FOUND, [AuthErrorDefine.notFoundUser])
  @SuccessResponse(HttpStatus.NO_CONTENT, [AuthSuccessDefine.logout])
  async logout(@AuthUser() user: UserExternalPayload) {
    return await this.service.logout(user);
  }
}
