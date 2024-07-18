import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";

import { AuthKit, AuthKitFramework } from "@template/trpc/authkit";

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
      const authKit = new AuthKit({
        tokenKey: TOKEN_KEY,
        headers: response?.headers,
        client: getApiClient(),
      });

      return json(successJsonDataResponse(true), {
        headers: combineHeaders(authKit.signout()),
      });
    },
    async refresh() {
      const authKit = new AuthKit({
        tokenKey: TOKEN_KEY,
        headers: response?.headers,
        client: getApiClient(),
      });

      const cookie = request.headers.get("cookie");

      const tokens = cookie
        ? authKit.getTokens(cookie, AuthKitFramework.Remix)
        : null;

      const { status, headers } = await authKit.checkRefresh(tokens);
      return json(successJsonDataResponse(status), {
        headers: combineHeaders(headers),
      });
    },
  });
};

export type RoutesActionData = typeof action;
