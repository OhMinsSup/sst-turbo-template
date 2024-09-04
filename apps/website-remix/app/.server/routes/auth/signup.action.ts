import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import type { FormFieldSignUpSchema } from "@template/sdk";
import {
  createHttpError,
  ErrorDisplayType,
  HttpStatus,
  isFetchError,
  RequestMethod,
} from "@template/sdk";

import { createRemixServerClient } from "~/.server/utils/auth";
import { errorJsonDataResponse } from "~/.server/utils/response";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export const action = async (ctx: ActionFunctionArgs) => {
  if (ctx.request.method.toUpperCase() !== RequestMethod.POST) {
    throw createHttpError({
      statusMessage: "Method Not Allowed",
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      displayType: ErrorDisplayType.TOAST,
      data: "not allowed method",
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const input: Awaited<FormFieldSignUpSchema> = await ctx.request.json();

  const headers = new Headers();

  try {
    const client = createRemixServerClient({
      request: ctx.request,
      headers,
    });

    await client.signUp(input, true);

    return redirect(safeRedirect(PAGE_ENDPOINTS.ROOT), {
      headers,
    });
  } catch (error) {
    if (isFetchError<RemixDataFlow.Response>(error)) {
      return json(errorJsonDataResponse(error.data?.message));
    }

    throw error;
  }
};

export type RoutesActionData = typeof action;
