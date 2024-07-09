import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";

import {
  errorJsonDataResponse,
  successJsonDataResponse,
} from "~/.server/utils/response";
import { setTheme } from "~/.server/utils/theme";
import { isTheme } from "~/store/theme-store";
import { combineHeaders, removeAuthTokenCookie } from "~/utils/misc";

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
      const headers = await Promise.resolve(
        combineHeaders(removeAuthTokenCookie()),
      );
      return json(successJsonDataResponse(true), {
        headers,
      });
    },
  });
};

export type RoutesActionData = typeof action;
