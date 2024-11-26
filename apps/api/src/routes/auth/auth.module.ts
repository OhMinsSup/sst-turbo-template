import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

import { UsersService } from "../users/services/users.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthErrorService } from "./errors";
import { AuthService } from "./services/auth.service";
import { IdentityService } from "./services/identity.service";
import { PasswordService } from "./services/password.service";
import { RoleService } from "./services/role.service";
import { SessionService } from "./services/session.service";
import { TokenService } from "./services/token.service";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    SessionService,
    UsersService,
    RoleService,
    IdentityService,
    AuthErrorService,
    JwtAuthGuard,
  ],
  exports: [
    AuthService,
    AuthErrorService,
    JwtAuthGuard,
    SessionService,
    TokenService,
    RoleService,
  ],
})
export class AuthModule {}
