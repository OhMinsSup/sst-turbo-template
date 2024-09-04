import type { CookieSerializeOptions } from "cookie";
import { parse as cookieParse, serialize as cookieSerialize } from "cookie";

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

/**
 * @deprecated Since v0.4.0: Please use {@link parseCookieHeader}. `parse` will
 * not be available for import starting v1.0.0 of `@supabase/ssr`.
 */
export const parse = cookieParse;

/**
 * @deprecated Since v0.4.0: Please use {@link serializeCookieHeader}.
 * `serialize` will not be available for import starting v1.0.0 of
 * `@supabase/ssr`.
 */
export const serialize = cookieSerialize;

/**
 * Parses the `Cookie` HTTP header into an array of cookie name-value objects.
 *
 * @param header The `Cookie` HTTP header. Decodes cookie names and values from
 * URI encoding first.
 */
export function parseCookieHeader(
  header: string,
): { name: string; value: string }[] {
  const parsed = cookieParse(header);

  return Object.keys(parsed ?? {}).map((name) => ({
    name,
    value: parsed[name] ?? "",
  }));
}

/**
 * Converts the arguments to a valid `Set-Cookie` header. Non US-ASCII chars
 * and other forbidden cookie chars will be URI encoded.
 *
 * @param name Name of cookie.
 * @param value Value of cookie.
 */
export function serializeCookieHeader(
  name: string,
  value: string,
  options: CookieSerializeOptions,
): string {
  return cookieSerialize(name, value, options);
}

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
