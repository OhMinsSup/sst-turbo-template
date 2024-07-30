import { getApiClient } from "$lib/api";
import { privateConfig } from "$lib/config/config.private";

import { AuthKit, AuthKitFramework, AuthKitStatus } from "@template/authkit";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
  const cookieValue = cookies.getAll();

  const authkit = new AuthKit({
    tokenKey: privateConfig.token,
    client: getApiClient(),
  });

  const { status, user, tokens } = await authkit.checkRefresh(
    authkit.getTokens(cookieValue, AuthKitFramework.SvelteKit),
  );

  if (tokens && status === AuthKitStatus.Refreshed) {
    cookies.set(privateConfig.token.accessTokenKey, tokens.accessToken.token, {
      httpOnly: true,
      expires: new Date(tokens.accessToken.expiresAt),
      path: "/",
      sameSite: "lax",
    });
    cookies.set(
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

  return new Response(
    JSON.stringify({
      user,
      loggedInStatus: status,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    },
  );
};
