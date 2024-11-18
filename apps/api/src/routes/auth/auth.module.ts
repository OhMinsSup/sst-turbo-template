import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

import { RoleService } from "../role/services/role.service";
import { UsersService } from "../users/services/users.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthErrorService } from "./errors/auth-error.service";
import { AuthService } from "./services/auth.service";
import { IdentityService } from "./services/identity.service";
import { PasswordService } from "./services/password.service";
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
  ],
})
export class AuthModule {}
