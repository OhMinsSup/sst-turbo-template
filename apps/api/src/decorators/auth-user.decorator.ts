import type { Request as ExpressRequest } from "express";
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

import type { PassportUser } from "../routes/auth/strategies/jwt.auth.strategy";
import { AuthErrorDefine, AuthNotLoginErrorCode } from "../routes/auth/errors";

export interface Request extends ExpressRequest {
  user?: PassportUser;
}

interface DecoratorOptions {
  allowUndefined?: boolean;
}

export const AuthUser = createParamDecorator(
  (options: DecoratorOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!options?.allowUndefined && (!request.user || !request.user.user)) {
      throw new ForbiddenException(AuthErrorDefine[AuthNotLoginErrorCode]);
    }

    return request.user ? request.user.user : undefined;
  },
);

export const OptionalAuthUser = createParamDecorator(
  (options: DecoratorOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user ? request.user.user : null;
  },
);
