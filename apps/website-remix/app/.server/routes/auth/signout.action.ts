import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import { HttpStatusCode, isAuthError } from "@template/common";
import { combineHeaders } from "@template/utils/request";

import { createRemixServerClient, requireUserId } from "~/.server/utils/auth";
import { toValidationErrorFormat } from "~/utils/error";

export const loader = () => {
  return safeRedirect("/");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = new Headers();

  const client = createRemixServerClient({
    request,
    headers,
  });

  try {
    await requireUserId({
      client,
      request,
    });
  } catch (error) {
    console.error(error);
    return json({
      success: false,
    });
  }

  const { error } = await client.signOut();

  if (isAuthError(error)) {
    // popup error
    return json({
      success: false,
    });
  }

  if (error?.error) {
    switch (error.statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return json({
          success: false,
          error: {},
        });
      }
      case HttpStatusCode.UNAUTHORIZED: {
        return json({
          success: false,
          error: {},
        });
      }
      case HttpStatusCode.BAD_REQUEST: {
        return json({
          success: false,
          error: toValidationErrorFormat(error),
        });
      }
      default: {
        console.error("Unhandled error", error);
      }
    }
  }
  return json(
    {
      success: true,
    },
    {
      headers: combineHeaders(headers),
    },
  );
};

export type RoutesActionData = typeof action;
