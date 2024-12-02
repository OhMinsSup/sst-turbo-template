import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import type { FormFieldSignInSchema } from "@template/validators/auth";
import { HttpResultCode, HttpStatusCode } from "@template/common";

import { auth } from "~/.server/utils/auth";
import { redirectWithToast } from "~/.server/utils/toast";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import {
  defaultToastErrorMessage,
  toErrorFormat,
  toValidationErrorFormat,
} from "~/libs/error";

export const action = async (args: ActionFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  const formData = await args.request.formData();

  const input = {
    email: formData.get("email"),
    password: formData.get("password"),
    provider: formData.get("provider"),
  } as FormFieldSignInSchema;

  const response = await authClient.signIn(input);

  if (response.error) {
    switch (response.error.statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return {
          success: false,
          error: toErrorFormat("email", response.error),
        };
      }
      case HttpStatusCode.BAD_REQUEST: {
        return {
          success: false,
          error:
            response.error.resultCode === HttpResultCode.INCORRECT_PASSWORD
              ? toErrorFormat("password", response.error)
              : toValidationErrorFormat(response.error),
        };
      }
      default: {
        return redirectWithToast(
          args.request.url,
          defaultToastErrorMessage(
            "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          ),
        );
      }
    }
  }

  return redirect(PAGE_ENDPOINTS.ROOT, {
    headers,
  });
};

export type RoutesActionData = typeof action;
