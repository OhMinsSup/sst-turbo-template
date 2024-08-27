import type { CookieOptions } from "../storages/cookie/types";

export const STORAGE_KEY = "template.session.token";

export const EXPIRY_MARGIN = 10; // in seconds

/** Current session will be checked for refresh at this interval. */
export const AUTO_REFRESH_TICK_DURATION = 30 * 1000;

/**
 * A token refresh will be attempted this many ticks before the current session expires. */
export const AUTO_REFRESH_TICK_THRESHOLD = 3;

export const BASE64_PREFIX = "base64-";

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  sameSite: "lax",
  httpOnly: false,
  maxAge: 60 * 60 * 24 * 365 * 1000,
};
