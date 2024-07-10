import type { ActionFunctionArgs } from "@remix-run/node";
import type { FormFieldSignInSchema } from "@template/sdk/schema";
import { json, redirect } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import {
  ErrorDisplayType,
  HttpResultStatus,
  HttpStatus,
  RequestMethod,
} from "@template/sdk/enum";
import { createHttpError } from "@template/sdk/error";

import { setAuthTokens } from "~/.server/utils/auth";
import { errorJsonDataResponse } from "~/.server/utils/response";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { createApiClient } from "~/store/app";
import { combineHeaders } from "~/utils/misc";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method.toUpperCase() !== RequestMethod.POST) {
    throw createHttpError({
      statusMessage: "Method Not Allowed",
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      displayType: ErrorDisplayType.TOAST,
      data: "not allowed method",
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const input: Awaited<FormFieldSignInSchema> = await request.json();
  const response = await createApiClient().rpc("signIn").post(input);
  if (response.error) {
    return json(errorJsonDataResponse(response.error));
  }

  if (response.resultCode !== HttpResultStatus.OK) {
    return json(errorJsonDataResponse(null));
  }

  const {
    result: { tokens },
  } = response;

  return redirect(safeRedirect(PAGE_ENDPOINTS.ROOT), {
    headers: combineHeaders(setAuthTokens(tokens)),
  });
};

export type RoutesActionData = typeof action;
