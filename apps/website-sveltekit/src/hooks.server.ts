import type { Handle } from "@sveltejs/kit";
import { NEXT_PUBLIC_SERVER_URL } from "$env/static/public";

import { createAuthServerClient } from "@template/sdk/auth";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.authenticates = createAuthServerClient({
    url: NEXT_PUBLIC_SERVER_URL,
    cookies: {
      getAll() {
        return event.cookies.getAll();
      },
      setAll(cookiesToSet) {
        /**
         * Note: You have to add the `path` variable to the
         * set and remove method due to sveltekit's cookie API
         * requiring this to be set, setting the path to an empty string
         * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
         */
        cookiesToSet.forEach(({ name, value, options }) =>
          event.cookies.set(name, value, { ...options, path: "/" }),
        );
      },
    },
  });

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const { session } = await event.locals.authenticates.getSession();
    if (!session) {
      return { session: null, user: null };
    }

    const { user, error } = await event.locals.authenticates.getUser();
    if (error) {
      // JWT validation has failed
      return { session: null, user: null };
    }

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};
