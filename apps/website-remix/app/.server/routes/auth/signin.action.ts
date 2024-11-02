import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import type { FormFieldSignInSchema } from "@template/sdk";
import { HttpStatusCode } from "@template/common";

import {
  createRemixServerClient,
  requireAnonymous,
} from "~/.server/utils/auth";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = new Headers();

  const client = createRemixServerClient({
    request,
    headers,
  });

  await requireAnonymous(client);

  const formData = await request.formData();

  const input = {
    email: formData.get("email"),
    password: formData.get("password"),
  } as FormFieldSignInSchema;

  const { error, data } = await client.signIn(input);

  console.log("error ==>", error);
  console.log("data ==>", data);

  if (error) {
    switch (error.statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return json({
          success: false,
          error: {
            email: {
              message: error.message,
            },
          },
        });
      }
      case HttpStatusCode.UNAUTHORIZED: {
        return json({
          success: false,
          error: {
            password: {
              message: error.message,
            },
          },
        });
      }
      case 400: {
        return json({
          success: false,
          error: Object.fromEntries(
            Object.entries(error.validationErrorInfo).map(([key, value]) => [
              key,
              {
                message: value,
              },
            ]),
          ),
        });
      }
    }
  }

  return redirect(safeRedirect(PAGE_ENDPOINTS.ROOT), {
    headers,
  });
};

export type RoutesActionData = typeof action;
