import { NEXT_PUBLIC_SERVER_URL } from "$env/static/public";

import {
  createAuthBrowserClient,
  createAuthServerClient,
} from "@template/sdk/auth";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends("authenticates:auth");

  const authenticates =
    typeof window !== "undefined"
      ? createAuthBrowserClient({
          url: NEXT_PUBLIC_SERVER_URL,
        })
      : createAuthServerClient({
          url: NEXT_PUBLIC_SERVER_URL,
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
