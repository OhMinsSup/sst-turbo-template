import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import type { FormFieldSignUpSchema } from "@template/sdk/schema";
import { AuthKit } from "@template/authkit";
import {
  ErrorDisplayType,
  HttpResultStatus,
  HttpStatus,
  RequestMethod,
} from "@template/sdk/enum";
import { createHttpError, isFetchError } from "@template/sdk/error";

import { errorJsonDataResponse } from "~/.server/utils/response";
import { privateConfig } from "~/config/config.private";
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
    tokenKey: privateConfig.token,
    headers: ctx.request.headers,
    client: getApiClient(),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const input: Awaited<FormFieldSignUpSchema> = await ctx.request.json();

  try {
    const response = await authKit.client.rpc("signUp").post(input);
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
  } catch (error) {
    if (isFetchError<RemixDataFlow.Response>(error)) {
      return json(errorJsonDataResponse(error.data?.message));
    }

    throw error;
  }
};

export type RoutesActionData = typeof action;
