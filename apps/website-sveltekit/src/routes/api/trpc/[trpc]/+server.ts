import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getApiClient } from "$lib/api";
import { privateConfig } from "$lib/config/config.private";

import { appRouter, createTRPCContext } from "@template/trpc/sveltekit";

const handler: RequestHandler = (event: RequestEvent) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: event.request,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        event,
        client: getApiClient(),
        tokenKey: privateConfig.token,
      }),
  });

export { handler as GET, handler as POST };
