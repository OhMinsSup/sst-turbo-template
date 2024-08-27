import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";

import { createRemixServerClient } from "~/.server/utils/auth";
import {
  errorJsonDataResponse,
  successJsonDataResponse,
} from "~/.server/utils/response";
import { setTheme } from "~/.server/utils/theme";
import { isTheme } from "~/store/theme";
import { combineHeaders } from "~/utils/misc";

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    async setTheme() {
      const requestText = await request.text();
      const form = new URLSearchParams(requestText);
      const theme = form.get("theme");
      if (!isTheme(theme)) {
        return json(errorJsonDataResponse(false));
      }
      return json(successJsonDataResponse(true), {
        headers: {
          "Set-Cookie": setTheme(theme),
        },
      });
    },

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
