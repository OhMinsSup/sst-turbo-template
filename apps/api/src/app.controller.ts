import { Controller, Get } from "@nestjs/common";

import type { UserExternalPayload } from "@template/db/selectors";

import { AppService } from "./app.service";
import { AuthUser } from "./decorators/auth-user.decorator";
import { JwtAuth } from "./guards/jwt-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hello")
  @JwtAuth()
  getHello(@AuthUser() user: UserExternalPayload): string {
    console.log(user);
    return this.appService.getHello();
  }
}
