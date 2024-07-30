import { createTRPCClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "@template/trpc/sveltekit";

export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return `http://localhost:${process.env.PORT ?? 5173}`;
  }
  return window.location.origin;
};

/**
 * A regular TRPC Client that can be used in the browser.
 *
 * Not recommended to use in SSR. Use initTRPCSSRClient instead.
 */
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    // With batching:
    httpBatchLink({
      url: getBaseUrl() + "/api/trpc",
    }),
  ],
});
