import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import type { UserExternalPayload } from "@template/db/selectors";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { ErrorResponse } from "../../../decorators/error-response.decorator";
import { SuccessResponse } from "../../../decorators/success-response.decorator";
import { JwtAuth } from "../../../guards/jwt-auth.guard";
import { AuthErrorDefine } from "../../../routes/auth/errors";
import { UserSuccessDefine } from "../../../shared/dtos/response/users/user-response.dto";
import { UsersService } from "../services/users.service";

@ApiTags("사용자")
@Controller("users")
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
  @SuccessResponse(HttpStatus.OK, [UserSuccessDefine.me])
  me(@AuthUser() user: UserExternalPayload) {
    return this.service.getMe(user);
  }
}
