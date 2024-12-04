import type { LoaderFunctionArgs } from "@remix-run/node";

import { getSession, invariantSession } from "~/.server/data/shared";
import { getWorkspaceListLoader } from "~/.server/data/workspace/list";
import { auth } from "~/.server/utils/auth";

export const loader = async (args: LoaderFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);
  const { session } = await getSession(authClient);

  invariantSession(session, {
    request: args.request,
    headers,
  });

  return getWorkspaceListLoader(args, {
    session,
    headers,
  });
};

export type RoutesLoaderData = typeof loader;
