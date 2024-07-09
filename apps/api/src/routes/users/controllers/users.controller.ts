import type { UserExternalPayload } from "@template/db/selectors";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthUser } from "src/decorators/auth-user.decorator";

import { HttpResultStatus } from "@template/sdk/enum";

import { JwtAuthGuard } from "../../../guards/jwt.auth.guard";
import { UsersService } from "../services/users.service";

@ApiTags("사용자")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  get(@AuthUser() user: UserExternalPayload) {
    return {
      resultCode: HttpResultStatus.OK,
      message: null,
      error: null,
      result: user,
    };
  }
}
