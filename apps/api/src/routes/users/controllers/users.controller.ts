import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "src/decorators/auth-user.decorator";
import { ErrorResponse } from "src/decorators/error-response.decorator";
import { SuccessResponse } from "src/decorators/success-response.decorator";
import { AuthErrorDefine } from "src/routes/auth/errors";
import { UserResponseDto } from "src/shared/dtos/response/users/user-response.dto";

import type { UserExternalPayload } from "@template/db/selectors";
import { HttpResultCode } from "@template/common";

import { JwtAuth } from "../../../guards/jwt-auth.guard";
import { UsersService } from "../services/users.service";

@ApiTags("사용자")
@Controller("users")
@JwtAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "로그인 사용자 정보" })
  @JwtAuth()
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine.invalidAuthorizationHeader,
    AuthErrorDefine.notLogin,
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [AuthErrorDefine.invalidToken])
  @ErrorResponse(HttpStatus.NOT_FOUND, [AuthErrorDefine.notFoundUser])
  @SuccessResponse(HttpStatus.OK, [
    {
      model: UserResponseDto,
      exampleDescription: "로그인 사용자 정보 조회에 성공한 경우 발생하는 응답",
      exampleTitle: "로그인 사용자 정보 조회 성공",
      resultCode: HttpResultCode.OK,
    },
  ])
  me(@AuthUser() user: UserExternalPayload) {
    return user;
  }
}
