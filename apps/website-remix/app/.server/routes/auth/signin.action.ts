import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import type { FormFieldSignInSchema } from "@template/sdk/schema";
import {
  ErrorDisplayType,
  HttpResultStatus,
  HttpStatus,
  RequestMethod,
} from "@template/sdk/enum";
import { createHttpError } from "@template/sdk/error";
import { AuthKit } from "@template/trpc/authkit";

import { TOKEN_KEY } from "~/.server/utils/constants";
import { errorJsonDataResponse } from "~/.server/utils/response";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { getApiClient } from "~/store/app";
import { combineHeaders } from "~/utils/misc";

export const action = async (ctx: ActionFunctionArgs) => {
  if (ctx.request.method.toUpperCase() !== RequestMethod.POST) {
    throw createHttpError({
      statusMessage: "Method Not Allowed",
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      displayType: ErrorDisplayType.TOAST,
      data: "not allowed method",
    });
  }

  const authKit = new AuthKit({
    tokenKey: TOKEN_KEY,
    headers: ctx.response?.headers,
    client: getApiClient(),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const input: Awaited<FormFieldSignInSchema> = await ctx.request.json();
  const response = await authKit.client.rpc("signIn").post(input);
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
    headers: combineHeaders(authKit.signin(tokens)),
  });
};

export type RoutesActionData = typeof action;
