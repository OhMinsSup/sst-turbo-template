import { initTRPCSSRClient } from "$lib/trpc/server";

import type { PageServerLoadEvent } from "./$types";

export async function load(event: PageServerLoadEvent) {
  const trpcClient = initTRPCSSRClient(event.request.headers, event.setHeaders);

  const message = await trpcClient.etc.hello.query();

  return {
    message,
  };
}
