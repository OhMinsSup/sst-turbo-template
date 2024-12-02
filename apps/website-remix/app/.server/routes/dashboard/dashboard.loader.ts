import type { LoaderFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";

import {
  getWorkspaceList,
  getWorkspaceListURLParmms,
} from "~/.server/data/worksacpe";
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

  const [ok, result] = await getWorkspaceList({
    query,
    session,
  });

  return data(
    {
      workspaces: ok ? result.list : [],
    },
    { headers },
  );
};

export type RoutesLoaderData = typeof loader;
