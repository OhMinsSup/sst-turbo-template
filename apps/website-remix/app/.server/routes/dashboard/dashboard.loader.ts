import type { LoaderFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";

import { auth, getSession } from "~/.server/utils/auth";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { api } from "~/libs/api";

interface Query {
  limit: number;
  pageNo: number;
  title?: string | null;
  orderBy: "createdAt" | "updatedAt" | undefined;
}

export const loader = async (args: LoaderFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  const { session } = await getSession(authClient);
  if (!session) {
    throw redirect(
      `${PAGE_ENDPOINTS.AUTH.SIGNIN}?redirectTo=${args.request.url}`,
      { headers },
    );
  }

  const url = new URL(args.request.url);

  const query = {
    limit: +(url.searchParams.get("limit") ?? "5"),
    pageNo: +(url.searchParams.get("pageNo") ?? "1"),
    title: url.searchParams.get("title"),
    orderBy: url.searchParams.get("orderBy") ?? "createdAt",
  } as Query;

  const { data: result, error } = await api
    .method("get")
    .path("/api/v1/workspaces")
    .setAuthorization(session.access_token)
    .setParams({ query })
    .run();

  if (error) {
    return data({ success: false, workspaces: [] }, { headers });
  }

  return data(
    {
      success: true,
      workspaces: result.data.list,
    },
    { headers },
  );
};

export type RoutesLoaderData = typeof loader;
