import type { ActionFunctionArgs } from "@remix-run/node";

import { Method } from "@template/common";

import {
  getSession,
  getTypeSafeMethod,
  invariantSession,
  invariantUnsupportedMethod,
} from "~/.server/data/shared";
import { createWorkspaceAction } from "~/.server/data/workspace/create";
import { favoriteWorkspaceAction } from "~/.server/data/workspace/favorite";
import { auth } from "~/.server/utils/auth";

export const action = async (args: ActionFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);
  const { session } = await getSession(authClient);

  invariantSession(session, {
    request: args.request,
    headers,
  });

  const method = getTypeSafeMethod(args.request);
  switch (method) {
    case Method.POST: {
      return await createWorkspaceAction(args, { session, headers });
    }
    case Method.PATCH: {
      return await favoriteWorkspaceAction(args, { session, headers });
    }
    default: {
      throw invariantUnsupportedMethod({
        request: args.request,
        headers,
      });
    }
  }
};

export type RoutesActionData = typeof action;
