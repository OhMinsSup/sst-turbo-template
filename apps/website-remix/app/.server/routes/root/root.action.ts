import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";

import { combineHeaders } from "@template/utils/request";

import { createRemixServerClient } from "~/.server/utils/auth";
import { successJsonDataResponse } from "~/.server/utils/response";

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    async logout() {
      const headers = new Headers();

      const client = createRemixServerClient({
        request,
        headers,
      });

      await client.signOut();

      return json(successJsonDataResponse(true), {
        headers: combineHeaders(headers),
      });
    },
  });
};

export type RoutesActionData = typeof action;
