import type {
  CookieMethodsServer,
  CookieOptionsWithName,
} from "./storages/cookie/types";
import type { AuthClientOptions } from "./types";
import { createAuthClient } from "./client";
import {
  applyServerStorage,
  createStorageFromOptions,
} from "./storages/cookie";

type Options = AuthClientOptions & {
  cookieOptions?: CookieOptionsWithName;
  cookies: CookieMethodsServer;
  cookieEncoding?: "raw" | "base64url";
};

export function createAuthServerClient(options: Options) {
  const { storage, getAll, setAll, setItems, removedItems } =
    createStorageFromOptions(
      {
        ...options,
        cookieEncoding: options.cookieEncoding ?? "base64url",
      },
      true,
    );

  const client = createAuthClient({
    ...options,
    ...(options.cookieOptions?.name
      ? { storageKey: options.cookieOptions.name }
      : null),
    autoRefreshToken: false,
    persistSession: true,
    storage,
  });

  client.onAuthStateChange(async (event) => {
    // The SIGNED_IN event is fired very often, but we don't need to
    // apply the storage each time it fires, only if there are changes
    // that need to be set -- which is if setItems / removeItems have
    // data.
    const hasStorageChanges =
      Object.keys(setItems).length > 0 || Object.keys(removedItems).length > 0;

    if (
      hasStorageChanges &&
      (event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED" ||
        event === "PASSWORD_RECOVERY" ||
        event === "SIGNED_OUT")
    ) {
      await applyServerStorage(
        { getAll, setAll, setItems, removedItems },
        {
          cookieOptions: options.cookieOptions ?? null,
          cookieEncoding: options.cookieEncoding ?? "base64url",
        },
      );
    }
  });

  return client;
}
