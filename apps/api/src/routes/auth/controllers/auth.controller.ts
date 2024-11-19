import { Body, Controller, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

import { ErrorResponse } from "../../../decorators/error-response.decorator";
import { SuccessResponse } from "../../../decorators/success-response.decorator";
import { AuthSuccessDefine } from "../../../shared/dtos/response/auth/auth-response.dto";
import { SignInDTO } from "../dto/signin.dto";
import { SignUpDTO } from "../dto/signup.dto";
import { TokenParamsDTO } from "../dto/token-params.dto";
import { TokenDTO } from "../dto/token.dto";
import { AuthErrorDefine, AuthErrorService } from "../errors";
import { AuthService } from "../services/auth.service";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly authError: AuthErrorService,
  ) {}

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
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine.incorrectPassword,
    AuthErrorDefine.signinValidation,
  ])
  @SuccessResponse(HttpStatus.OK, [AuthSuccessDefine.signin])
  async signIn(@Body() body: SignInDTO) {
    return await this.service.signIn(body);
  }

  @SkipThrottle()
  @Post("token")
  @ApiOperation({ summary: "토큰 재발급" })
  @ApiQuery({
    required: true,
    description: "토큰 재발급 API",
    type: TokenParamsDTO,
  })
  @ApiBody({
    required: true,
    description: "토큰 재발급 API",
    type: TokenDTO,
  })
  async token(@Body() body: TokenDTO, @Param() params: TokenParamsDTO) {
    return await this.service.token(body, params);
  }
}
