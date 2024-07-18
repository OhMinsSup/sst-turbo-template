import { getApiClient } from "$lib/api";
import { privateConfig } from "$lib/config/config.private";

import { AuthKit, AuthKitFramework } from "@template/authkit";

import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
  const authkit = new AuthKit({
    tokenKey: privateConfig.token,
    client: getApiClient(),
  });

  const { status, user, tokens } = await authkit.checkAuth(
    authkit.getTokens(event.cookies.getAll(), AuthKitFramework.SvelteKit),
  );

  if (tokens) {
    event.cookies.set(
      privateConfig.token.accessTokenKey,
      tokens.accessToken.token,
      {
        httpOnly: true,
        expires: new Date(tokens.accessToken.expiresAt),
        path: "/",
        sameSite: "lax",
      },
    );
    event.cookies.set(
      privateConfig.token.refreshTokenKey,
      tokens.refreshToken.token,
      {
        httpOnly: true,
        expires: new Date(tokens.refreshToken.expiresAt),
        path: "/",
        sameSite: "lax",
      },
    );
  }

  const data = {
    env: import.meta.env,
    userPrefs: {
      theme: null,
    },
    toast: null,
    user,
    loggedInStatus: status,
  };

  return data;
}) satisfies LayoutServerLoad;
