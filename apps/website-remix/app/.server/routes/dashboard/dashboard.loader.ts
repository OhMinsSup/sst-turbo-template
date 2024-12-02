import type { LoaderFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";
import hash from "stable-hash";

import { getCacheWorkspaceList } from "~/.server/cache/workspace";
import { getWorkspaceListURLParmms } from "~/.server/data/workspace";
import { auth, getSession } from "~/.server/utils/auth";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export const loader = async (args: LoaderFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  const { session } = await getSession(authClient);
  if (!session) {
    throw redirect(
      `${PAGE_ENDPOINTS.AUTH.SIGNIN}?redirectTo=${args.request.url}`,
      { headers },
    );
  }

  const query = getWorkspaceListURLParmms(args.request);
  const queryHashKey = hash(query);

  const [ok, result] = await getCacheWorkspaceList({
    query,
    session,
    queryHashKey,
  });

  return data(
    {
      workspaces: ok ? result.list : [],
      queryHashKey,
    },
    { headers },
  );
};

export type RoutesLoaderData = typeof loader;
