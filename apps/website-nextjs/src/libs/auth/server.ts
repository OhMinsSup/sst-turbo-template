import { cookies } from "next/headers";

import { createAuthServerClient } from "@template/auth/server";

import { getApiClient } from "~/utils/api-client";

export function createClient() {
  const cookieStore = cookies();

  return createAuthServerClient({
    api: getApiClient(),
    logDebugMessages: false,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
