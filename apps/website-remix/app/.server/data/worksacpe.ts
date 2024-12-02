import type { paths } from "@template/api-types";
import type { Session } from "@template/auth";

import { api } from "~/libs/api";

// Path: apps/website-remix/app/.server/routes/dashboard/dashboard.loader.ts

interface GetWorkspaceListParams {
  session: Session;
  query?: paths["/api/v1/workspaces"]["get"]["parameters"]["query"];
}

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
    sortTag: url.searchParams.get("sortTag") as
      | "createdAt"
      | "updatedAt"
      | "order",
    sortOrder: url.searchParams.get("sortOrder") as "asc" | "desc",
  };
};

export const getWorkspaceList = async ({
  query,
  session,
}: GetWorkspaceListParams) => {
  const { data, error } = await api
    .method("get")
    .path("/api/v1/workspaces")
    .setAuthorization(session.access_token)
    .setParams({
      query,
    })
    .run();

  if (error) {
    return [false, error.error, error] as const;
  }

  return [true, data.data, data] as const;
};

// Path: apps/website-remix/app/.server/routes/dashboard/dashboard.action.ts - create

export const postWorkspaceRequestBody = async (request: Request) => {
  const formData = await request.formData();

  return {
    title: formData.get("title"),
    description: formData.get("description"),
  } as paths["/api/v1/workspaces"]["post"]["requestBody"]["content"]["application/json"];
};

interface PostWorkspaceParams {
  requestBody: paths["/api/v1/workspaces"]["post"]["requestBody"]["content"]["application/json"];
  session: Session;
}

export const postWorkspace = async ({
  requestBody,
  session,
}: PostWorkspaceParams) => {
  const { data, error } = await api
    .method("post")
    .path("/api/v1/workspaces")
    .setBody(requestBody)
    .setAuthorization(session.access_token)
    .run();

  if (error) {
    return [false, error.error, error] as const;
  }

  return [true, data.data, data] as const;
};

// Path: apps/website-remix/app/.server/routes/dashboard/dashboard.action.ts - favorite
export const patchFavoriteWorkspaceRequestBody = async (request: Request) => {
  const formData = await request.formData();

  const workspaceId = formData.get("workspaceId");
  if (!workspaceId) {
    throw new Error("workspaceId is required");
  }

  return [
    +workspaceId,
    {
      isFavorite: formData.get("isFavorite") === "true",
    } as paths["/api/v1/workspaces/{id}/favorite"]["patch"]["requestBody"]["content"]["application/json"],
  ] as const;
};

interface PatchFavoriteWorkspaceParams {
  workspaceId: number;
  requestBody: paths["/api/v1/workspaces/{id}/favorite"]["patch"]["requestBody"]["content"]["application/json"];
  session: Session;
}

export const patchFavoriteWorkspace = async ({
  workspaceId,
  requestBody,
  session,
}: PatchFavoriteWorkspaceParams) => {
  const { data, error } = await api
    .method("patch")
    .path("/api/v1/workspaces/{id}/favorite")
    .setParams({
      path: {
        id: workspaceId,
      },
    })
    .setAuthorization(session.access_token)
    .setBody(requestBody)
    .run();

  if (error) {
    return [false, error.error, error] as const;
  }

  return [true, data.data, data] as const;
};
