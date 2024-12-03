import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { OpenApiErrorDefine } from "src/routes/auth/open-api";

import { TokenType } from "@template/common";

import type { JwtPayload } from "../routes/auth/services/auth.service";
import { AuthService } from "../routes/auth/services/auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //@NoAuthorized 사용시 해당 부분에서 AccessTokenGuard 사용 해제시킴
    const noAuthorized = this.reflector.get<boolean>(
      "un-authorized",
      context.getHandler(),
    );
    if (noAuthorized) {
      return true;
    }
    return this.validateRequest(this.getRequest(context), context);
  }

  private async validateRequest(request: Request, _: ExecutionContext) {
    const tokenString = this.extractTokenFromHeader(request);

    const payload = await this.jwtService.verifyAsync<JwtPayload>(tokenString);

    const { user, session } =
      await this.authService.maybeLoadUserOrSession(payload);

    const newObj: Request = request;
    Object.assign(newObj, { user, session });

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization || (authorization && Array.isArray(authorization))) {
      throw new UnauthorizedException(
        OpenApiErrorDefine.invalidAuthorizationHeader,
      );
    }

    const tokenString = authorization.split(`${TokenType.Bearer} `).at(-1);
    if (!tokenString) {
      throw new UnauthorizedException(
        OpenApiErrorDefine.invalidAuthorizationHeader,
      );
    }

    return tokenString;
  }

  getRequest<T = unknown>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  getResponse<T = unknown>(context: ExecutionContext): T {
    return context.switchToHttp().getResponse();
  }
}

export function JwtAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
