import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";

import { refresh, signout } from "@template/trpc/share";

import { TOKEN_KEY } from "~/.server/utils/constants";
import {
  errorJsonDataResponse,
  successJsonDataResponse,
} from "~/.server/utils/response";
import { setTheme } from "~/.server/utils/theme";
import { getApiClient } from "~/store/app";
import { isTheme } from "~/store/theme-store";
import { combineHeaders } from "~/utils/misc";

export const action = async ({ request, response }: ActionFunctionArgs) => {
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
    // eslint-disable-next-line @typescript-eslint/require-await
    async logout() {
      return json(successJsonDataResponse(true), {
        headers: combineHeaders(signout(TOKEN_KEY) as unknown as Headers),
      });
    },
    async refresh() {
      const { status, headers } = await refresh({
        headers: request.headers,
        client: getApiClient(),
        resHeaders: response?.headers ?? new Headers(),
        tokenKey: TOKEN_KEY,
      });
      switch (status) {
        case "action:notLogin":
        case "action:refreshed": {
          return json(successJsonDataResponse(status), {
            headers: combineHeaders(headers),
          });
        }
        default: {
          return json(errorJsonDataResponse(status), {
            headers: combineHeaders(headers),
          });
        }
      }
    },
  });
};

export type RoutesActionData = typeof action;
