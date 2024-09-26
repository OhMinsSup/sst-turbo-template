import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { safeRedirect } from "remix-utils/safe-redirect";

import { RequestMethod } from "@template/sdk";
import { combineHeaders } from "@template/utils/request";

import { createRemixServerClient, requireUserId } from "~/.server/utils/auth";
import {
  errorJsonDataResponse,
  successJsonDataResponse,
  validateRequestMethods,
} from "~/.server/utils/response";

export const loader = () => {
  return safeRedirect("/");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = new Headers();

  const client = createRemixServerClient({
    request,
    headers,
  });

  validateRequestMethods(request, [RequestMethod.POST]);

  try {
    console.log("request ==>", request.url);
    await requireUserId({
      client,
      request,
    });
  } catch (error) {
    console.error(error);
    console.error("User not found");
    return json(errorJsonDataResponse(false));
  }

  const { error } = await client.signOut();

  console.log("error ==>", error);

  if (error) {
    console.error(error);
    return json(errorJsonDataResponse(false));
  }

  return json(successJsonDataResponse(true), {
    headers: combineHeaders(headers),
  });
};

export type RoutesActionData = typeof action;
