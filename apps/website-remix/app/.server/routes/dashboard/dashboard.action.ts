import type { ActionFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";

import type { FormFieldCreateWorkspace } from "@template/validators/workspace";
import { HttpStatusCode } from "@template/common";

import { auth, getSession } from "~/.server/utils/auth";
import { redirectWithToast } from "~/.server/utils/toast";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { api } from "~/libs/api";
import { toValidationErrorFormat } from "~/libs/error";

export const action = async (args: ActionFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  const { session } = await getSession(authClient);

  if (!session) {
    throw redirect(
      `${PAGE_ENDPOINTS.AUTH.SIGNIN}?redirectTo=${args.request.url}`,
      { headers },
    );
  }

  const formData = await args.request.formData();
  const input = {
    title: formData.get("title"),
    description: formData.get("description"),
  } as FormFieldCreateWorkspace;

  const result = await api
    .method("post")
    .path("/api/v1/workspaces")
    .setBody(input)
    .setAuthorization(session.access_token)
    .run();

  if (result.error) {
    switch (result.error.statusCode) {
      case HttpStatusCode.BAD_REQUEST: {
        return data(
          {
            success: false as const,
            error: toValidationErrorFormat(result.error),
          },
          {
            headers,
          },
        );
      }
      default: {
        throw redirectWithToast(
          args.request.url,
          {
            type: "error",
            title: "서버 오류",
            description: result.error.error.message,
          },
          {
            headers,
          },
        );
      }
    }
  }

  return data(
    {
      success: true as const,
      workspace: result.data.data,
    },
    { headers },
  );
};

export type RoutesActionData = typeof action;
