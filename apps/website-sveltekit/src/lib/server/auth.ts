import type { RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { getApiClient } from "$lib/api-client";
import jwt from "jsonwebtoken";

import { HttpResultStatus } from "@template/sdk/enum";
import { isAccessTokenExpireDate } from "@template/utils/date";

export const TOKEN_KEY = {
  ACCESS_TOKEN: env.ACCESS_TOKEN_NAME,
  REFRESH_TOKEN: env.REFRESH_TOKEN_NAME,
};

export async function verifyToken(accessToken: string) {
  try {
    await getApiClient().rpc("verify").post({
      token: accessToken,
    });
    return true;
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    };
  }

  // accessToken의 decode해서 만료일자를 가져온다.
  const decode = jwt.decode(accessToken, { json: true });
  if (!decode) {
    return {
      status: "action:dencodeTokenError" as const,
      tokens: null,
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
      };
    } catch (error) {
      // 발급이 실패한 상태
      return {
        status: "action:invalidRefreshToken" as const,
        tokens: null,
      };
    }
  }

  // refresh를 할 필요가 없는 경우
  return {
    status: "action:notRefreshed" as const,
    tokens: null,
  };
}

export async function refreshTokenFromRequest(event: RequestEvent<any>) {
  const { refreshToken } = getAuthTokens(event);
  // 쿠키는 존재하지만 인증 토큰이 존재하는지 체크가 필요
  if (!refreshToken) {
    // 액세스 토큰도 없고 refresh token도 없는 경우
    clearAuthTokens(event);
    return {
      status: "action:notLogin" as const,
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

    event.cookies.set(TOKEN_KEY.ACCESS_TOKEN, tokens.accessToken.token, {
      httpOnly: true,
      expires: new Date(tokens.accessToken.expiresAt),
      path: "/",
      sameSite: "lax",
    });
    event.cookies.set(TOKEN_KEY.REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      expires: new Date(tokens.refreshToken.expiresAt),
      path: "/",
      sameSite: "lax",
    });

    const userRes = await getUserInfo(tokens.accessToken.token);

    return {
      status: "action:refreshed" as const,
      user: userRes,
    };
  } catch (error) {
    // 액세스 토큰도 없고 refresh token도 없는 경우
    clearAuthTokens(event);
    return {
      status: "action:error" as const,
      user: null,
    };
  }
}

export async function getAuthFormRequest(event: RequestEvent<any>) {
  const { accessToken, refreshToken } = getAuthTokens(event);
  if (!accessToken) {
    // 액세스 토큰은 없지만 refresh token이 존재하는 경우 refresh token으로 액세스 토큰을 갱신한다.
    if (refreshToken) {
      return await refreshTokenFromRequest(event);
    }

    return {
      status: "action:notLogin" as const,
      user: null,
    };
  }

  try {
    // 토큰이 존재하는 해당 토큰이 잘못된 토큰인지 체크한다.
    if (!(await verifyToken(accessToken))) {
      return {
        status: "action:invalidToken" as const,
        user: null,
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
        };
      }
      case "action:notRefreshed": {
        // refreshToken으로 accessToken을 갱신할 필요가 없는 경우
        break;
      }
      default: {
        return {
          status,
          user: null,
        };
      }
    }

    const userRes = await getUserInfo(accessToken);

    return {
      status: "action:loggedIn" as const,
      user: userRes,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "action:error" as const,
      user: null,
    };
  }
}

export const getAuthTokens = (event: RequestEvent<any>) => {
  const accessToken = event.cookies.get(TOKEN_KEY.ACCESS_TOKEN);
  const refreshToken = event.cookies.get(TOKEN_KEY.REFRESH_TOKEN);
  return {
    accessToken,
    refreshToken,
  };
};

export const clearAuthTokens = (
  event: RequestEvent<any>,
  omit?: keyof typeof TOKEN_KEY,
) => {
  const keys = Object.keys(TOKEN_KEY).filter((key) => {
    if (omit) {
      return key !== omit;
    }
    return true;
  });
  for (const key of keys) {
    if (event.cookies.get(key)) {
      event.cookies.delete(key, {
        path: "/",
      });
    }
  }
};
