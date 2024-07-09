import cookie from "cookie";

import { HttpResultStatus } from "@template/sdk/enum";

import { CONSTANT_KEY } from "~/constants/constants";
import { createApiClient } from "~/store/app";

export async function getAuthFromRequest(request: Request) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) {
    return null;
  }
  const cookies = cookie.parse(cookieString);
  const accessToken = cookies[CONSTANT_KEY.ACCESS_TOKEN];
  if (!accessToken) {
    return null;
  }

  try {
    const verifyRes = await createApiClient().rpc("verify").post({
      token: accessToken,
    });

    if (verifyRes.error) {
      return null;
    }

    if (verifyRes.resultCode !== HttpResultStatus.OK) {
      return null;
    }

    // access token이 만료되기 5분 전에 refresh token을 사용하여 access token을 갱신한다.
    const COOOKIE_EXPIRE_REG = /expires=(.*);/;

    const userRes = await createApiClient()
      .rpc("me")
      .setAuthToken(accessToken)
      .get();

    if (userRes.error) {
      return null;
    }

    if (userRes.resultCode !== HttpResultStatus.OK) {
      return null;
    }

    return userRes.result;
  } catch (error) {
    return null;
  }
}

export async function validateRefreshToken(request: Request) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) {
    return null;
  }
  const cookies = cookie.parse(cookieString);
  const refreshToken = cookies[CONSTANT_KEY.REFRESH_TOKEN];
  const accessToken = cookies[CONSTANT_KEY.ACCESS_TOKEN];

  if (!refreshToken || !accessToken) {
    return null;
  }

  try {
    const response = await createApiClient().rpc("refresh").patch({
      refreshToken,
    });

    if (response.error) {
      return null;
    }

    if (response.resultCode !== HttpResultStatus.OK) {
      return null;
    }

    const {
      result: { tokens },
    } = response;

    return response.result;
  } catch (error) {
    return null;
  }
}
