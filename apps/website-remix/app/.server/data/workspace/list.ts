import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import type { paths } from "@template/api-types";
import type { Session } from "@template/auth";

import type { CustomLoaderArgs } from "~/types/app";
import { getCacheWorkspaceList } from "~/.server/cache/workspace";
import { api } from "~/libs/api";
import { defaultListData } from "../shared";

// Get workspace list

export interface GetWorkspaceListParams {
  session: Session;
  query?: paths["/api/v1/workspaces"]["get"]["parameters"]["query"];
}

export const listApi = ({ session, query }: GetWorkspaceListParams) => {
  return api
    .method("get")
    .path("/api/v1/workspaces")
    .setAuthorization(session.access_token)
    .setParams({
      query,
    })
    .run();
};

export const getWorkspaceListURLParmms = (
  request: Request,
): paths["/api/v1/workspaces"]["get"]["parameters"]["query"] => {
  const url = new URL(request.url);
  const isFavoriteString = url.searchParams.get("isFavorite");
  const isFavorite =
    typeof isFavoriteString === "string" &&
    ["true", "false"].includes(isFavoriteString)
      ? isFavoriteString === "true"
      : undefined;
  return {
    isFavorite,
    pageNo: +(url.searchParams.get("pageNo") ?? "1"),
    limit: +(url.searchParams.get("limit") ?? "5"),
    sortTag: (url.searchParams.get("sortTag") ?? "createdAt") as
      | "createdAt"
      | "updatedAt"
      | "order",
    sortOrder: (url.searchParams.get("sortOrder") ?? "desc") as "asc" | "desc",
  };
};

export const getWorkspaceList = async (params: GetWorkspaceListParams) => {
  const { data, error } = await listApi(params);
  if (error) {
    return [false, error.error, error] as const;
  }
  return [true, data.data, data] as const;
};

export const getWorkspaceListLoader = async (
  args: LoaderFunctionArgs,
  { session, headers, useCache = true }: CustomLoaderArgs,
) => {
  const params = {
    query: getWorkspaceListURLParmms(args.request),
    session,
  };

  const [ok, result] = await (useCache
    ? getCacheWorkspaceList(params)
    : getWorkspaceList(params));

  if (!ok) {
    return data(defaultListData(), { headers });
  }

  return data(result, { headers });
};
