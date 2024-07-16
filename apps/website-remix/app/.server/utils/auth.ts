import cookie from "cookie";
import jwt from "jsonwebtoken";

import type { TokenResponse } from "@template/sdk";
import { HttpResultStatus } from "@template/sdk/enum";
import { isHttpError } from "@template/sdk/error";
import { isAccessTokenExpireDate } from "@template/utils/date";

import { getApiClient } from "~/store/app";
import { combineHeaders } from "~/utils/misc";

export const TOKEN_KEY = {
  ACCESS_TOKEN: process.env.ACCESS_TOKEN_NAME,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN_NAME,
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

export async function verifyToken(accessToken: string) {
  try {
    await getApiClient().rpc("verify").post({
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
    const userRes = await getApiClient()
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
  // refresh token이 없는 경우 재발급 안되게 처리
  if (!refreshToken) {
    return {
      status: "action:invalidRefreshToken" as const,
      tokens: null,
      headers: combineHeaders(clearAuthTokens()),
    };
  }

  // accessToken의 decode해서 만료일자를 가져온다.
  const decode = jwt.decode(accessToken, { json: true });
  if (!decode) {
    return {
      status: "action:dencodeTokenError" as const,
      tokens: null,
      headers: combineHeaders(clearAuthTokens()),
    };
  }

  // access token이 만료되기 5분 전에 refresh token을 사용하여 access token을 갱신한다.
  if (decode.exp && isAccessTokenExpireDate(decode.exp * 1000)) {
    try {
      // 발급이 완료된 상태
      const refreshRes = await getApiClient().rpc("refresh").patch({
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
      // 발급이 실패한 상태
      return {
        status: "action:invalidRefreshToken" as const,
        tokens: null,
        headers: combineHeaders(clearAuthTokens()),
      };
    }
  }

  // refresh를 할 필요가 없는 경우
  return {
    status: "action:notRefreshed" as const,
    tokens: null,
    headers: null,
  };
}

export async function getAuthFromRequest(request: Request) {
  const cookieString = request.headers.get("Cookie");
  // 쿠키 정보가 없는 경우
  if (!cookieString) {
    return {
      status: "action:notLogin" as const,
      user: null,
      headers: null,
    };
  }

  const { accessToken, refreshToken } = getAuthTokens(cookieString);
  // 쿠키는 존재하지만 인증 토큰이 존재하는지 체크가 필요
  if (!accessToken) {
    // accessToken이 없는 경우 refreshToken으로 accessToken을 갱신한다.
    if (refreshToken) {
      return await refreshTokenFromRequest(request);
    }

    return {
      status: "action:notLogin" as const,
      user: null,
      headers: null,
    };
  }

  try {
    // 토큰이 존재하는 해당 토큰이 잘못된 토큰인지 체크한다.
    if (!(await verifyToken(accessToken))) {
      return {
        status: "action:invalidToken" as const,
        user: null,
        headers: combineHeaders(clearAuthTokens()),
      };
    }

    // accessToken이 만료되기 5분 전에 refreshToken으로 accessToken을 갱신한다.
    const { status, tokens } = await validateRefreshToken(
      accessToken,
      refreshToken,
    );

    switch (status) {
      case "action:refreshed": {
        // 새로운 토큰 정보를 header에 적용시킨 후 유저 정보를 가져온다.
        const userRes = await getUserInfo(tokens.accessToken.token);
        return {
          status,
          user: userRes,
          headers: combineHeaders(setAuthTokens(tokens)),
        };
      }
      case "action:notRefreshed": {
        // refreshToken으로 accessToken을 갱신할 필요가 없는 경우
        break;
      }
      default: {
        // 재발급시 에러가 발생하는 경우
        return {
          status,
          user: null,
          headers: null,
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
    console.error(error);
    return {
      status: "action:error" as const,
      user: null,
      headers: combineHeaders(clearAuthTokens()),
    };
  }
}

export async function refreshTokenFromRequest(request: Request) {
  const cookieString = request.headers.get("Cookie");
  // 쿠키 정보가 없는 경우
  if (!cookieString) {
    return {
      status: "action:notLogin" as const,
      headers: null,
    };
  }

  const { refreshToken } = getAuthTokens(cookieString);
  // 쿠키는 존재하지만 인증 토큰이 존재하는지 체크가 필요
  if (!refreshToken) {
    return {
      status: "action:notLogin" as const,
      headers: null,
      user: null,
    };
  }

  try {
    const refreshRes = await getApiClient().rpc("refresh").patch({
      refreshToken,
    });

    const {
      result: { tokens },
    } = refreshRes;

    const userRes = await getUserInfo(tokens.accessToken.token);

    return {
      status: "action:refreshed" as const,
      user: userRes,
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
