import type { ActionFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import type { paths } from "@template/api-types";
import type { Session } from "@template/auth";

import type { CustomActionArgs } from "~/types/app";
import { hardPurgeWorkspaceList } from "~/.server/cache/workspace";
import { redirectWithToast } from "~/.server/utils/toast";
import { api } from "~/libs/api";
import { defaultToastErrorMessage } from "~/libs/error";

interface PatchFavoriteWorkspaceParams {
  workspaceId: number;
  requestBody: paths["/api/v1/workspaces/{id}/favorite"]["patch"]["requestBody"]["content"]["application/json"];
  session: Session;
}

export const favoriteApi = ({
  workspaceId,
  requestBody,
  session,
}: PatchFavoriteWorkspaceParams) => {
  return api
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
};

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

export const patchFavoriteWorkspace = async (
  params: PatchFavoriteWorkspaceParams,
) => {
  const { data, error } = await favoriteApi(params);
  if (error) {
    return [false, error.error, error] as const;
  }
  return [true, data.data, data] as const;
};

export const favoriteWorkspaceAction = async (
  args: ActionFunctionArgs,
  { session, headers }: Omit<CustomActionArgs, "useCache">,
) => {
  const [workspaceId, requestBody] = await patchFavoriteWorkspaceRequestBody(
    args.request,
  );
  const [ok, result] = await patchFavoriteWorkspace({
    workspaceId,
    requestBody,
    session,
  });

  if (!ok) {
    throw redirectWithToast(
      args.request.url,
      defaultToastErrorMessage(result.message),
      {
        headers,
      },
    );
  }

  hardPurgeWorkspaceList();

  return data(
    {
      success: true as const,
      workspace: result,
    },
    { headers },
  );
};
