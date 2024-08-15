export const STORAGE_KEY = "sdk.auth.token";

export const EXPIRY_MARGIN = 10; // in seconds

/** Current session will be checked for refresh at this interval. */
export const AUTO_REFRESH_TICK_DURATION = 30 * 1000;

/**
 * A token refresh will be attempted this many ticks before the current session expires. */
export const AUTO_REFRESH_TICK_THRESHOLD = 3;
