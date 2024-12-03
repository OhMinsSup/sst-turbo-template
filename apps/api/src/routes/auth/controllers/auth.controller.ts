import { Body, Controller, Post, Query } from "@nestjs/common";
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

import type { UserExternalPayload } from "@template/db/selectors";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { JwtAuth } from "../../../guards/jwt-auth.guard";
import { HttpErrorDto } from "../../../shared/dtos/models/http-error.dto";
import { ValidationErrorDto } from "../../../shared/dtos/models/validation-error.dto";
import { AuthResponseDto } from "../../../shared/dtos/response/auth/auth-response.dto";
import { LogoutResponseDto } from "../../../shared/dtos/response/auth/logout-response.dto";
import { SignInDTO } from "../dto/signin.dto";
import { SignUpDTO } from "../dto/signup.dto";
import { TokenQueryDTO } from "../dto/token-query.dto";
import { TokenDTO } from "../dto/token.dto";
import {
  OpenApiBadRequestErrorDefine,
  OpenApiConflictErrorDefine,
  OpenApiForbiddenErrorDefine,
  OpenApiNotFoundErrorDefine,
  OpenApiSuccessResponseDefine,
  OpenApiUnauthorizedErrorDefine,
} from "../open-api";
import { AuthService } from "../services/auth.service";

@ApiTags("인증")
@Controller("auth")
@ApiExtraModels(
  HttpErrorDto,
  ValidationErrorDto,
  AuthResponseDto,
  LogoutResponseDto,
)
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signUp")
  @ApiOperation({ summary: "이메일+비밀번호 회원가입" })
  @ApiBody({
    required: true,
    description: "회원가입 API",
    type: SignUpDTO,
  })
  @ApiResponse(OpenApiSuccessResponseDefine.auth)
  @ApiResponse(OpenApiUnauthorizedErrorDefine.unsupportedAuthMethod)
  @ApiResponse(OpenApiNotFoundErrorDefine.roleNotFound)
  @ApiResponse(OpenApiBadRequestErrorDefine.signUp)
  async signUp(@Body() body: SignUpDTO) {
    return await this.service.signUp(body);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("signIn")
  @ApiOperation({ summary: "이메일+비밀번호 로그인" })
  @ApiBody({
    required: true,
    description: "로그인 API",
    type: SignInDTO,
  })
  @ApiResponse(OpenApiBadRequestErrorDefine.signIn)
  @ApiResponse(OpenApiUnauthorizedErrorDefine.unsupportedAuthMethod)
  @ApiResponse(OpenApiNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiSuccessResponseDefine.auth)
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
  @ApiResponse(OpenApiBadRequestErrorDefine.token)
  @ApiResponse(OpenApiForbiddenErrorDefine.suspensionUser)
  @ApiResponse(OpenApiUnauthorizedErrorDefine.unsupportedGrantType)
  @ApiResponse(OpenApiSuccessResponseDefine.auth)
  @ApiResponse(OpenApiConflictErrorDefine.tooManyTokenRefreshRequests)
  async token(@Body() body: TokenDTO, @Query() query: TokenQueryDTO) {
    return await this.service.token(body, query);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post("logout")
  @ApiOperation({ summary: "로그아웃" })
  @JwtAuth()
  @ApiResponse(OpenApiUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiBadRequestErrorDefine.invalidToken)
  @ApiResponse(OpenApiNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiSuccessResponseDefine.logout)
  async logout(@AuthUser() user: UserExternalPayload) {
    return await this.service.logout(user);
  }
}
