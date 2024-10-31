import {
  applyDecorators,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JsonWebTokenError } from "jsonwebtoken";

import {
  AuthErrorDefine,
  AuthNotExistUserErrorCode,
  AuthTokenExpiredErrorCode,
} from "../routes/auth/errors";

@Injectable()
export class JwtAuthGuard extends AuthGuard(["jwt"]) {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    if (!user) {
      throw new UnauthorizedException(
        AuthErrorDefine[AuthNotExistUserErrorCode],
      );
    }

    if (err) {
      throw err;
    }

    if (info && info instanceof Error) {
      if (info instanceof JsonWebTokenError) {
        info = String(info);
      }

      throw new UnauthorizedException(
        AuthErrorDefine[AuthTokenExpiredErrorCode],
      );
    }

    return user;
  }
}

export function JwtAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
