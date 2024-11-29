import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import { auth, getSession } from "~/.server/utils/auth";
import { api } from "~/utils/api";

export const loader = async (args: LoaderFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  const { session } = await getSession(authClient);

  if (!session) {
    return data({ workspaces: [] }, { headers });
  }

  const url = new URL(args.request.url);

  const query = {
    limit: +(url.searchParams.get("limit") ?? "20"),
    pageNo: +(url.searchParams.get("pageNo") ?? "1"),
    title: url.searchParams.get("title"),
  };

  const { data: result, error } = await api
    .method("get")
    .path("/api/v1/workspaces")
    .setAuthorization(session.access_token)
    .setParams({ query })
    .run();

  if (error) {
    return data({ workspaces: [] }, { headers });
  }

  return data(
    {
      workspaces: result.data.list,
    },
    { headers },
  );
};

export type RoutesLoaderData = typeof loader;
