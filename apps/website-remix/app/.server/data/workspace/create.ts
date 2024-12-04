import type { ActionFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import type { paths } from "@template/api-types";
import type { Session } from "@template/auth";
import { HttpStatusCode } from "@template/common";

import type { CustomActionArgs } from "~/types/app";
import { hardPurgeWorkspaceList } from "~/.server/cache/workspace";
import { redirectWithToast } from "~/.server/utils/toast";
import { api } from "~/libs/api";
import {
  defaultToastErrorMessage,
  toValidationErrorFormat,
} from "~/libs/error";

interface PostWorkspaceParams {
  requestBody: paths["/api/v1/workspaces"]["post"]["requestBody"]["content"]["application/json"];
  session: Session;
}

export const createApi = ({ requestBody, session }: PostWorkspaceParams) => {
  return api
    .method("post")
    .path("/api/v1/workspaces")
    .setBody(requestBody)
    .setAuthorization(session.access_token)
    .run();
};

export const postWorkspaceRequestBody = async (request: Request) => {
  const formData = await request.formData();
  return {
    title: formData.get("title"),
    description: formData.get("description"),
  } as paths["/api/v1/workspaces"]["post"]["requestBody"]["content"]["application/json"];
};

export const postWorkspace = async (params: PostWorkspaceParams) => {
  const { data, error } = await createApi(params);
  if (error) {
    return [false, error.error, error] as const;
  }
  return [true, data.data, data] as const;
};

export const createWorkspaceAction = async (
  args: ActionFunctionArgs,
  { session, headers }: Omit<CustomActionArgs, "useCache">,
) => {
  const [ok, result, response] = await postWorkspace({
    session,
    requestBody: await postWorkspaceRequestBody(args.request),
  });

  if (!ok) {
    switch (response.statusCode) {
      case HttpStatusCode.BAD_REQUEST: {
        return data(
          {
            success: false as const,
            error: toValidationErrorFormat(response),
          },
          {
            headers,
          },
        );
      }
      default: {
        throw redirectWithToast(
          args.request.url,
          defaultToastErrorMessage(result.message),
          {
            headers,
          },
        );
      }
    }
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
