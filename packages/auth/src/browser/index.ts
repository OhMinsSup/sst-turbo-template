import { isBrowser } from "@template/utils/assertion";

import type { AuthClientType } from "..";
import type {
  CookieMethodsBrowser,
  CookieOptionsWithName,
} from "../storages/cookie/types";
import type { AuthClientOptions } from "../types";
import { createAuthClient } from "..";
import { createStorageFromOptions } from "../storages/cookie";

export type Options = AuthClientOptions & {
  cookieOptions?: CookieOptionsWithName;
  cookies?: CookieMethodsBrowser;
  cookieEncoding?: "raw" | "base64url";
  isSingleton?: boolean;
};

let cachedBrowserClient: AuthClientType | undefined;

export function createAuthBrowserClient(options: Options) {
  // singleton client is created only if isSingleton is set to true, or if isSingleton is not defined and we detect a browser
  const shouldUseSingleton =
    options.isSingleton === true ||
    (!("isSingleton" in options) && isBrowser());

  if (shouldUseSingleton && cachedBrowserClient) {
    return cachedBrowserClient;
  }

  const { storage } = createStorageFromOptions(
    {
      ...options,
      cookieEncoding: options.cookieEncoding ?? "base64url",
    },
    false,
  );

  const client = createAuthClient({
    ...options,
    ...(options.cookieOptions?.name
      ? { storageKey: options.cookieOptions.name }
      : null),
    autoRefreshToken: isBrowser(),
    persistSession: true,
    storage,
  });

  if (shouldUseSingleton) {
    cachedBrowserClient = client;
  }

  return client;
}
