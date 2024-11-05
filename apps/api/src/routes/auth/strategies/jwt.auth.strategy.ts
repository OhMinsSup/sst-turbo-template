import type { Request } from "express";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import type { UserExternalPayload } from "@template/db/selectors";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { UsersService } from "../../../routes/users/services/users.service";
import {
  AuthErrorDefine,
  AuthNotLoginErrorCode,
  AuthUserSuspensionErrorCode,
} from "../errors";

export type JwtPayload = { sub: string; jti?: string };
export type PassportUser = { user?: UserExternalPayload };

const fromCookie = (cookieName: string) => {
  return (request: Request) => {
    let token: string | null = null;
    if (request && request.cookies) {
      token = request.cookies[cookieName];
    }
    return token;
  };
};
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly env: EnvironmentService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        fromCookie(env.getAccessTokenName()),
      ]),
      secretOrKey: env.getAccessTokenSecret(),
    });
  }

  async validate({ sub }: JwtPayload): Promise<PassportUser> {
    const user = await this.users.getExternalUserById(sub);

    if (!user) {
      throw new UnauthorizedException(AuthErrorDefine[AuthNotLoginErrorCode]);
    }

    if (user.isSuspended) {
      throw new UnauthorizedException(
        AuthErrorDefine[AuthUserSuspensionErrorCode],
      );
    }

    return {
      user,
    };
  }
}
