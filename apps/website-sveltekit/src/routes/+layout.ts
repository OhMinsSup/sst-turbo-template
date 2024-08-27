import { NEXT_PUBLIC_SERVER_URL } from "$env/static/public";

import {
  createAuthBrowserClient,
  createAuthServerClient,
} from "@template/sdk/auth";
import { isBrowser } from "@template/utils/assertion";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends("authenticates:auth");

  const authenticates = isBrowser()
    ? createAuthBrowserClient({
        url: NEXT_PUBLIC_SERVER_URL,
        logDebugMessages: false,
      })
    : createAuthServerClient({
        url: NEXT_PUBLIC_SERVER_URL,
        logDebugMessages: false,
        cookies: {
          getAll() {
            return data.cookies;
          },
        },
      });

  /**
   * It's fine to use `getSession` here, because on the client, `getSession` is
   * safe, and on the server, it reads `session` from the `LayoutData`, which
   * safely checked the session using `safeGetSession`.
   */
  const { session } = await authenticates.getSession();

  return { authenticates, session };
};
