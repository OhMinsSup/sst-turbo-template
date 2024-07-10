import type { TokenResponse } from "@template/sdk";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import { HttpResultStatus } from "@template/sdk/enum";
import { isHttpError } from "@template/sdk/error";
import { isAccessTokenExpireDate } from "@template/utils/date";

import { CONSTANT_KEY } from "~/constants/constants";
import { createApiClient } from "~/store/app";
import { combineHeaders } from "~/utils/misc";

export function clearAuthTokens() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    cookie.serialize(CONSTANT_KEY.ACCESS_TOKEN, "", { path: "/", maxAge: -1 }),
  );
  headers.append(
    "Set-Cookie",
    cookie.serialize(CONSTANT_KEY.REFRESH_TOKEN, "", { path: "/", maxAge: -1 }),
  );
  return headers;
}

export function setAuthTokens(token: TokenResponse) {
  const { accessToken, refreshToken } = token;

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    cookie.serialize(CONSTANT_KEY.ACCESS_TOKEN, accessToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(accessToken.expiresAt),
    }),
  );
  headers.append(
    "Set-Cookie",
    cookie.serialize(CONSTANT_KEY.REFRESH_TOKEN, refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(refreshToken.expiresAt),
    }),
  );

  return headers;
}

export function getAuthTokens(cookieString: string) {
  const cookies = cookie.parse(cookieString);
  const accessToken = cookies[CONSTANT_KEY.ACCESS_TOKEN];
  const refreshToken = cookies[CONSTANT_KEY.REFRESH_TOKEN];
  return {
    accessToken,
    refreshToken,
  };
}

export async function verifyToken(accessToken: string) {
  try {
    await createApiClient().rpc("verify").post({
      token: accessToken,
    });
    return true;
  } catch (error) {
    console.error(error);
    if (isHttpError(error)) {
      console.error(error);
    }
    return false;
  }
}

export async function getUserInfo(accessToken: string) {
  try {
    const userRes = await createApiClient()
      .rpc("me")
      .setAuthToken(accessToken)
      .get();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (userRes.error || userRes.resultCode !== HttpResultStatus.OK) {
      return null;
    }

    return userRes.result;
  } catch (error) {
    if (isHttpError(error)) {
      console.error(error);
    }
    return null;
  }
}

export async function validateRefreshToken(
  accessToken: string,
  refreshToken?: string | null,
) {
  if (!refreshToken) {
    return {
      status: "action:invalidRefreshToken" as const,
      tokens: null,
      headers: null,
    };
  }

  // access token이 만료되기 5분 전에 refresh token을 사용하여 access token을 갱신한다.
  const decode = jwt.decode(accessToken, { json: true });
  if (!decode) {
    return {
      status: "action:dencodeTokenError" as const,
      tokens: null,
      headers: null,
    };
  }

  if (decode.exp && isAccessTokenExpireDate(decode.exp * 1000)) {
    try {
      const refreshRes = await createApiClient().rpc("refresh").patch({
        refreshToken,
      });

      const {
        result: { tokens },
      } = refreshRes;

      return {
        status: "action:refreshed" as const,
        tokens,
        headers: combineHeaders(setAuthTokens(tokens)),
      };
    } catch (error) {
      return {
        status: "action:invalidRefreshToken" as const,
        tokens: null,
        headers: null,
      };
    }
  }

  return {
    status: "action:notRefreshed" as const,
    tokens: null,
    headers: null,
  };
}

export async function getAuthFromRequest(request: Request) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) {
    return {
      status: "action:notLogin" as const,
      user: null,
      headers: combineHeaders(clearAuthTokens()),
    };
  }

  const { accessToken, refreshToken } = getAuthTokens(cookieString);
  if (!accessToken) {
    return {
      status: "action:notLogin" as const,
      user: null,
      headers: combineHeaders(clearAuthTokens()),
    };
  }

  try {
    if (!(await verifyToken(accessToken))) {
      return {
        status: "action:invalidToken" as const,
        user: null,
        headers: combineHeaders(clearAuthTokens()),
      };
    }

    const { status, tokens } = await validateRefreshToken(
      accessToken,
      refreshToken,
    );

    switch (status) {
      case "action:refreshed": {
        const userRes = await getUserInfo(tokens.accessToken.token);
        return {
          status,
          user: userRes,
          headers: combineHeaders(setAuthTokens(tokens)),
        };
      }
      case "action:notRefreshed": {
        break;
      }
      default: {
        return {
          status,
          user: null,
          headers: combineHeaders(clearAuthTokens()),
        };
      }
    }

    const userRes = await getUserInfo(accessToken);

    return {
      status: "action:loggedIn" as const,
      user: userRes,
      headers: null,
    };
  } catch (error) {
    return {
      status: "action:error" as const,
      user: null,
      headers: combineHeaders(clearAuthTokens()),
    };
  }
}

export async function refreshTokenFromRequest(request: Request) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) {
    return {
      status: "action:notLogin" as const,
      headers: combineHeaders(clearAuthTokens()),
    };
  }

  const { accessToken, refreshToken } = getAuthTokens(cookieString);
  if (!accessToken || !refreshToken) {
    return {
      status: "action:notLogin" as const,
      headers: combineHeaders(clearAuthTokens()),
    };
  }

  try {
    const refreshRes = await createApiClient().rpc("refresh").patch({
      refreshToken,
    });

    const {
      result: { tokens },
    } = refreshRes;

    return {
      status: "action:refreshed" as const,
      headers: combineHeaders(setAuthTokens(tokens)),
    };
  } catch (error) {
    return {
      status: "action:error" as const,
      user: null,
      headers: combineHeaders(clearAuthTokens()),
    };
  }
}
