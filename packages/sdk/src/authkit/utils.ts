import { clearCookie, setTokenCookie } from "@template/utils/cookie";
import { combineHeaders } from "@template/utils/request";

import type { TokenResponse } from "../api/types";
import type { AuthKitTokenKey } from "./types";

/**
 * Merge token and headers
 */
export function mergeTokenHeaders(
  tokenKey: AuthKitTokenKey,
  token: TokenResponse,
  defaultHeaders?: Headers,
): Headers {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    setTokenCookie(tokenKey.accessTokenKey, token.accessToken),
  );
  headers.append(
    "Set-Cookie",
    setTokenCookie(tokenKey.refreshTokenKey, token.refreshToken),
  );
  return combineHeaders(defaultHeaders, headers);
}

/**
 *  Merge clear auth tokens
 */
export function mergeClearAuthTokens(
  tokenKey: AuthKitTokenKey,
  defaultHeaders?: Headers,
): Headers {
  const headers = new Headers();
  headers.append("Set-Cookie", clearCookie(tokenKey.accessTokenKey));
  headers.append("Set-Cookie", clearCookie(tokenKey.refreshTokenKey));
  return combineHeaders(defaultHeaders, headers);
}
