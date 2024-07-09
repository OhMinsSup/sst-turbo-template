import cookie from "cookie";

import { TokenResponse } from "@template/sdk";

import { CONSTANT_KEY } from "~/constants/constants";

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ??
    request.headers.get("host") ??
    new URL(request.url).host;
  const protocol = request.headers.get("X-Forwarded-Proto") ?? "http";
  return `${protocol}://${host}`;
}

export function getReferrerRoute(request: Request) {
  // spelling errors and whatever makes this annoyingly inconsistent
  // in my own testing, `referer` returned the right value, but 🤷‍♂️
  const referrer =
    request.headers.get("referer") ??
    request.headers.get("referrer") ??
    request.referrer;
  const domain = getDomainUrl(request);
  if (referrer.startsWith(domain)) {
    return referrer.slice(domain.length);
  } else {
    return "/";
  }
}

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(
  ...headers: (ResponseInit["headers"] | null | undefined)[]
) {
  const merged = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
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
) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}

/**
 * Combine multiple response init objects into one (uses combineHeaders)
 */
export function combineResponseInits(
  ...responseInits: (ResponseInit | null | undefined)[]
) {
  let combined: ResponseInit = {};
  for (const responseInit of responseInits) {
    combined = {
      ...responseInit,
      headers: combineHeaders(combined.headers, responseInit?.headers),
    };
  }
  return combined;
}

export function setAuthTokenCookie(token: TokenResponse) {
  const { accessToken, refreshToken } = token;

  const accessTokenCookie = cookie.serialize(
    CONSTANT_KEY.ACCESS_TOKEN,
    accessToken.token,
    {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(accessToken.expiresAt),
    },
  );

  const refreshTokenCookie = cookie.serialize(
    CONSTANT_KEY.REFRESH_TOKEN,
    refreshToken.token,
    {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(refreshToken.expiresAt),
    },
  );

  const headers = new Headers();
  headers.append("Set-Cookie", accessTokenCookie);
  headers.append("Set-Cookie", refreshTokenCookie);

  return headers;
}

export function removeAuthTokenCookie() {
  const headers = new Headers();
  headers.append("Set-Cookie", "template.access_token=; Max-Age=0; Path=/");
  headers.append("Set-Cookie", "template.refresh_token=; Max-Age=0; Path=/");
  return headers;
}
