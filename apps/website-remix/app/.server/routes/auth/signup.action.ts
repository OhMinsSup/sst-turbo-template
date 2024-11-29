import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import type { FormFieldSignUpSchema } from "@template/validators/auth";
import { HttpStatusCode } from "@template/common";

import { auth } from "~/.server/utils/auth";
import { redirectWithToast } from "~/.server/utils/toast";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { toErrorFormat, toValidationErrorFormat } from "~/utils/error";

export const action = async (args: ActionFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  const formData = await args.request.formData();

  const input = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    username: formData.get("username"),
    provider: formData.get("provider"),
  } as FormFieldSignUpSchema;

  const result = await authClient.signUp(input);

  if (result.error) {
    switch (result.error.statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return {
          success: false,
          error: toErrorFormat("email", result.error),
        };
      }
      case HttpStatusCode.BAD_REQUEST: {
        return {
          success: false,
          error: toValidationErrorFormat(result.error),
        };
      }
      default: {
        return redirectWithToast(args.request.url, {
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
