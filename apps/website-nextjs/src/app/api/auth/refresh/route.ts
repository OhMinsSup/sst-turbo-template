import { revalidateTag } from "next/cache";
import { cookies, headers } from "next/headers";

import { AuthKit, AuthKitFramework, AuthKitStatus } from "@template/authkit";

import { env } from "~/env";
import { getApiClient } from "~/store/api/api-client";

export async function POST() {
  const authKit = new AuthKit({
    tokenKey: {
      accessTokenKey: env.ACCESS_TOKEN_NAME,
      refreshTokenKey: env.REFRESH_TOKEN_NAME,
    },
    headers: new Headers(headers()),
    client: getApiClient(),
  });

  const cookie = headers().get("cookie");

  const { status, user, tokens } = await authKit.checkRefresh(
    cookie ? authKit.getTokens(cookie, AuthKitFramework.Next) : null,
  );

  if (tokens && [AuthKitStatus.Refreshed].includes(status)) {
    cookies().set(env.ACCESS_TOKEN_NAME, tokens.accessToken.token, {
      httpOnly: true,
      expires: new Date(tokens.accessToken.expiresAt),
      path: "/",
      sameSite: "lax",
    });
    cookies().set(env.REFRESH_TOKEN_NAME, tokens.refreshToken.token, {
      httpOnly: true,
      expires: new Date(tokens.refreshToken.expiresAt),
      path: "/",
      sameSite: "lax",
    });
  }

  const data = {
    user,
    loggedInStatus: status,
  };

  revalidateTag("auth");

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  });
}
