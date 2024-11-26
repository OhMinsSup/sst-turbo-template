import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import type { FormFieldSignInSchema } from "@template/validators/auth";
import { HttpResultCode, HttpStatusCode } from "@template/common";

import { createRemixServerAuthClient } from "~/.server/utils/auth";
import { redirectWithToast } from "~/.server/utils/toast";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { toErrorFormat, toValidationErrorFormat } from "~/utils/error";

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = new Headers();

  const client = createRemixServerAuthClient({
    request,
    headers,
  });

  const formData = await request.formData();

  const input = {
    email: formData.get("email"),
    password: formData.get("password"),
    provider: formData.get("provider"),
  } as FormFieldSignInSchema;

  const { error } = await client.signIn(input);

  if (error?.error) {
    switch (error.statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return {
          success: false,
          error: toErrorFormat("email", error),
        };
      }
      case HttpStatusCode.BAD_REQUEST: {
        return {
          success: false,
          error:
            error.resultCode === HttpResultCode.INCORRECT_PASSWORD
              ? toErrorFormat("password", error)
              : toValidationErrorFormat(error),
        };
      }
      default: {
        return redirectWithToast(request.url, {
          type: "error",
          title: "서버 오류",
          description: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    }
  }

  return redirect(safeRedirect(PAGE_ENDPOINTS.ROOT), {
    headers,
  });
};

export type RoutesActionData = typeof action;
