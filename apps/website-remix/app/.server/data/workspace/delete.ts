import type { ActionFunctionArgs } from "@remix-run/node";
import { replace } from "@remix-run/node";

import type { Session } from "@template/auth";

import type { CustomActionArgs } from "~/types/app";
import { hardPurgeWorkspaceList } from "~/.server/cache/workspace";
import { redirectWithToast } from "~/.server/utils/toast";
import { api } from "~/libs/api";
import { defaultToastErrorMessage } from "~/libs/error";

interface DeleteWorkspaceParams {
  workspaceId: number;
  session: Session;
}

export const deleteApi = ({ workspaceId, session }: DeleteWorkspaceParams) => {
  return api
    .method("delete")
    .path("/api/v1/workspaces/{id}")
    .setParams({
      path: {
        id: workspaceId,
      },
    })
    .setAuthorization(session.access_token)
    .run();
};

export const deleteWorkspaceRequestBody = async (request: Request) => {
  const formData = await request.formData();

  const workspaceId = formData.get("workspaceId");
  if (!workspaceId) {
    throw new Error("workspaceId is required");
  }

  return +workspaceId;
};

export const deleteWorkspace = async (params: DeleteWorkspaceParams) => {
  const { data, error } = await deleteApi(params);
  if (error) {
    return [false, error.error, error] as const;
  }
  return [true, data.data, data] as const;
};

export const deleteWorkspaceAction = async (
  args: ActionFunctionArgs,
  { session, headers }: Omit<CustomActionArgs, "useCache">,
) => {
  const [ok, result] = await deleteWorkspace({
    session,
    workspaceId: await deleteWorkspaceRequestBody(args.request),
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

  return replace(args.request.url, {
    headers,
  });
};
