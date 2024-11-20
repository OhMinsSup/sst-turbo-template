import type { ExecutionContext } from "@nestjs/common";
import type { Request as ExpressRequest } from "express";
import { createParamDecorator, ForbiddenException } from "@nestjs/common";

import type { Session } from "@template/db";
import type { UserExternalPayload } from "@template/db/selectors";

import { AuthErrorDefine } from "../routes/auth/errors";

export interface Request extends ExpressRequest {
  user?: UserExternalPayload;
  session?: Session;
}

interface DecoratorOptions {
  allowUndefined?: boolean;
}

export const AuthUser = createParamDecorator(
  (options: DecoratorOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new ForbiddenException(AuthErrorDefine.notLogin);
    }

    return request.user;
  },
);

export const OptionalAuthUser = createParamDecorator(
  (options: DecoratorOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user ? request.user : null;
  },
);
