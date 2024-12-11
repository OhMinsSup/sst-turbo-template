import { Controller, Get } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import type { UserExternalPayload } from "@template/db/selectors";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { JwtAuth } from "../../../guards/jwt-auth.guard";
import {
  OpenApiBadRequestErrorDefine,
  OpenApiNotFoundErrorDefine,
  OpenApiUnauthorizedErrorDefine,
} from "../../../routes/auth/open-api";
import { HttpErrorDto } from "../../../shared/dtos/models/http-error.dto";
import { ValidationErrorDto } from "../../../shared/dtos/models/validation-error.dto";
import { UserResponseDto } from "../../../shared/dtos/response/users/user-response.dto";
import { OpenApiSuccessResponseDefine } from "../open-api";
import { UsersService } from "../services/users.service";

@ApiTags("사용자")
@Controller("users")
@ApiExtraModels(HttpErrorDto, ValidationErrorDto, UserResponseDto)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "로그인 사용자 정보" })
  @JwtAuth()
  @ApiResponse(OpenApiUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiBadRequestErrorDefine.invalidToken)
  @ApiResponse(OpenApiSuccessResponseDefine.me)
  me(@AuthUser() user: UserExternalPayload) {
    return this.service.getMe(user);
  }

  updateUsername() {}

  updateUserImage() {}
}
