import type { TokenResponse } from "@template/sdk";
import { clearCookie, setTokenCookie } from "@template/utils/cookie";

import type { AuthKitTokenKey } from "../types";

/**
 * Convert headers to an array of key-value pairs
 */
export function headersToEntries(headers: Headers): [string, string][] {
  const entries: [string, string][] = [];
  headers.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
}

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(
  ...headers: (ResponseInit["headers"] | null | undefined)[]
): Headers {
  const merged = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of headersToEntries(new Headers(header))) {
      merged.set(key, value);
    }
  }
  return merged;
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
  ...headers: (ResponseInit["headers"] | null | undefined)[]
): Headers {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of headersToEntries(new Headers(header))) {
      combined.append(key, value);
    }
  }
  return combined;
}

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
