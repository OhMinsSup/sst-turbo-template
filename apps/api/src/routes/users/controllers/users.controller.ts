import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import type { UserExternalPayload } from "@template/db/selectors";
import { HttpResultStatus } from "@template/sdk";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { JwtAuth } from "../../../guards/jwt.auth.guard";
import { OptionalJwtAuth } from "../../../guards/optional-jwt.auth.guard";
import { UsersService } from "../services/users.service";

@ApiTags("사용자")
@Controller("users")
@JwtAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOperation({ summary: "로그인 사용자 정보" })
  @JwtAuth()
  me(@AuthUser() user: UserExternalPayload) {
    return {
      resultCode: HttpResultStatus.OK,
      message: null,
      error: null,
      result: user,
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "아이디로 사용자 정보 조회" })
  @OptionalJwtAuth()
  async byUserId(@Param("id") id: string) {
    return await this.service.getExternalUserById(id);
  }
}
