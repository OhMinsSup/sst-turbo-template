import cookie from "cookie";

interface GetTokenFromCookieOptions {
  accessTokenKey: string | RegExp;
  refreshTokenKey: string | RegExp;
}

export const getTokenFromCookie = (
  cookieString: string,
  opts: GetTokenFromCookieOptions = {
    accessTokenKey: /.*\.access_token/,
    refreshTokenKey: /.*\.refresh_token/,
  },
) => {
  const cookies = cookie.parse(cookieString);
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  for (const key in cookies) {
    if (opts.accessTokenKey instanceof RegExp) {
      if (opts.accessTokenKey.test(key)) {
        accessToken = cookies[key] ?? null;
      }
    } else if (key === opts.accessTokenKey) {
      accessToken = cookies[key] ?? null;
    }

    if (opts.refreshTokenKey instanceof RegExp) {
      if (opts.refreshTokenKey.test(key)) {
        refreshToken = cookies[key] ?? null;
      }
    } else if (key === opts.refreshTokenKey) {
      refreshToken = cookies[key] ?? null;
    }
  }

  return {
    accessToken,
    refreshToken,
  };
};

export const setTokenCookie = (
  key: string,
  value: {
    token: string;
    expiresAt: number | Date | string;
  },
  options: Omit<
    cookie.CookieSerializeOptions,
    "httpOnly" | "sameSite" | "expires"
  > = {},
) => {
  return cookie.serialize(key, value.token, {
    ...options,
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(value.expiresAt),
  });
};

export const setCookie = (
  key: string,
  value: string,
  options: cookie.CookieSerializeOptions = {},
) => {
  return cookie.serialize(key, value, options);
};

export const clearCookie = (key: string) =>
  cookie.serialize(key, "", {
    path: "/",
    maxAge: -1,
  });
