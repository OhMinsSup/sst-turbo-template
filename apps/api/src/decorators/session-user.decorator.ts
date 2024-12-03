import type { ExecutionContext } from "@nestjs/common";
import type { Request as ExpressRequest } from "express";
import { createParamDecorator, ForbiddenException } from "@nestjs/common";
import { OpenApiErrorDefine } from "src/routes/auth/open-api";

import type { Session } from "@template/db";
import type { UserExternalPayload } from "@template/db/selectors";

export interface Request extends ExpressRequest {
  user?: UserExternalPayload;
  session?: Session;
}

interface DecoratorOptions {
  allowUndefined?: boolean;
}

export const SessionUser = createParamDecorator(
  (options: DecoratorOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.session) {
      throw new ForbiddenException(OpenApiErrorDefine.notLogin);
    }

    return request.session;
  },
);

export const OptionalSessionUser = createParamDecorator(
  (options: DecoratorOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.session ? request.session : null;
  },
);
