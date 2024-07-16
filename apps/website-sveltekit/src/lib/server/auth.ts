import { env } from "$env/dynamic/private";
import cookie from "cookie";

import type { TokenResponse } from "@template/sdk";

export const TOKEN_KEY = {
  ACCESS_TOKEN: env.ACCESS_TOKEN_NAME,
  REFRESH_TOKEN: env.REFRESH_TOKEN_NAME,
};

export function clearAuthTokens() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    cookie.serialize(TOKEN_KEY.ACCESS_TOKEN, "", { path: "/", maxAge: -1 }),
  );
  headers.append(
    "Set-Cookie",
    cookie.serialize(TOKEN_KEY.REFRESH_TOKEN, "", { path: "/", maxAge: -1 }),
  );
  return headers;
}

export function setAuthTokens(token: TokenResponse) {
  const { accessToken, refreshToken } = token;

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    cookie.serialize(TOKEN_KEY.ACCESS_TOKEN, accessToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(accessToken.expiresAt),
    }),
  );
  headers.append(
    "Set-Cookie",
    cookie.serialize(TOKEN_KEY.REFRESH_TOKEN, refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(refreshToken.expiresAt),
    }),
  );

  return headers;
}

export function getAuthTokens(cookieString: string) {
  const cookies = cookie.parse(cookieString);
  const accessToken = cookies[TOKEN_KEY.ACCESS_TOKEN];
  const refreshToken = cookies[TOKEN_KEY.REFRESH_TOKEN];
  return {
    accessToken,
    refreshToken,
  };
}
