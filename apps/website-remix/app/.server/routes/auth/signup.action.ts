import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";
import { undefined } from "zod";

import type { FormFieldSignUpSchema } from "@template/sdk";
import { isFetchError, isHttpError, RequestMethod } from "@template/sdk";

import {
  createRemixServerClient,
  requireAnonymous,
} from "~/.server/utils/auth";
import {
  errorJsonDataResponse,
  validateRequestMethods,
} from "~/.server/utils/response";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = new Headers();

  const client = createRemixServerClient({
    request,
    headers,
  });

  try {
    validateRequestMethods(request, [RequestMethod.POST]);

    await requireAnonymous(client);

    const formData = await request.formData();

    const input = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      name: formData.get("name") || undefined,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      avatarUrl: formData.get("avatarUrl") || undefined,
    } as FormFieldSignUpSchema;

    await client.signUp(input, true);

    return redirect(safeRedirect(PAGE_ENDPOINTS.ROOT), {
      headers,
    });
  } catch (error) {
    if (isFetchError<RemixDataFlow.Response>(error)) {
      return json(errorJsonDataResponse(error.data?.message));
    }

    if (isHttpError(error)) {
      return json(errorJsonDataResponse(error.message));
    }

    throw error;
  }
};

export type RoutesActionData = typeof action;
