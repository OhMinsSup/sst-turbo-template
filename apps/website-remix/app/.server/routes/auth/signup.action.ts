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

import { errorJsonDataResponse } from "~/.server/utils/response";
import { sessionStorage } from "~/.server/utils/session";
import { PAGE_ENDPOINTS, SESSION_DATA_KEY } from "~/constants/constants";
import { createAuthticationClient } from "~/store/app/provider";

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

  try {
    const data = await createAuthticationClient().signUp(input, true);

    const cookieSession = await sessionStorage.getSession(
      ctx.request.headers.get("Cookie"),
    );

    cookieSession.set(SESSION_DATA_KEY.dataKey, data.session);

    return redirect(safeRedirect(PAGE_ENDPOINTS.ROOT), {
      headers: {
        "set-cookie": await sessionStorage.commitSession(cookieSession),
      },
    });
  } catch (error) {
    if (isFetchError<RemixDataFlow.Response>(error)) {
      return json(errorJsonDataResponse(error.data?.message));
    }

    throw error;
  }
};

export type RoutesActionData = typeof action;
