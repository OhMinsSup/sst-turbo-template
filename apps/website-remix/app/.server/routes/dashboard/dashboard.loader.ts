import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import { auth, getSession } from "~/.server/utils/auth";
import { getApiClient } from "~/utils/api-client";

export const loader = async (args: LoaderFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  const { session } = await getSession(authClient);

  if (!session) {
    return data({ workspaces: [] }, { headers });
  }

  const { data: result } = await getApiClient()
    .method("get")
    .path("/api/v1/workspaces")
    .setAuthorization(session.access_token)
    .setParams({ query: { limit: 10 } })
    .run();

  console.log(session);

  result?.data.list;
  return data(
    {
      workspaces: result?.data.list.map((data) => {
        data.id;
        return {
          ...data,
        };
      }),
    },
    { headers },
  );
};

export type RoutesLoaderData = typeof loader;
