import { Body, Controller, Get, Patch } from "@nestjs/common";
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import type { UserExternalPayload } from "@template/db/selectors";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { JwtAuth } from "../../../guards/jwt-auth.guard";
import {
  OpenApiAuthBadRequestErrorDefine,
  OpenApiAuthNotFoundErrorDefine,
  OpenApiAuthUnauthorizedErrorDefine,
} from "../../../routes/auth/open-api";
import { HttpErrorDto } from "../../../shared/dtos/models/http-error.dto";
import { ValidationErrorDto } from "../../../shared/dtos/models/validation-error.dto";
import { UserResponseDto } from "../../../shared/dtos/response/users/user-response.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import {
  OpenApiUserBadRequestErrorDefine,
  OpenApiUserSuccessResponseDefine,
} from "../open-api";
import { UsersService } from "../services/users.service";

@ApiTags("사용자")
@Controller("users")
@ApiExtraModels(HttpErrorDto, ValidationErrorDto, UserResponseDto)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "로그인 사용자 정보" })
  @JwtAuth()
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiAuthNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiAuthBadRequestErrorDefine.invalidToken)
  @ApiResponse(OpenApiUserSuccessResponseDefine.me)
  me(@AuthUser() user: UserExternalPayload) {
    return this.service.getMe(user);
  }

  @Patch()
  @ApiOperation({ summary: "키와 매칭되는 사용자 정보 변경 API" })
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiAuthNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiUserBadRequestErrorDefine.update)
  @ApiResponse(OpenApiUserSuccessResponseDefine.me)
  @JwtAuth()
  @ApiBody({
    required: true,
    description: "사용자 정보 변경",
    type: UpdateUserDto,
  })
  update(@AuthUser() user: UserExternalPayload, @Body() body: UpdateUserDto) {
    return this.service.update(user, body);
  }
}
