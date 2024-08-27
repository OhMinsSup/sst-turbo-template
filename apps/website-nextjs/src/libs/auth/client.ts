import { createAuthBrowserClient } from "@template/sdk/auth";

import { env } from "~/env";

export function createClient() {
  return createAuthBrowserClient({
    url: env.NEXT_PUBLIC_SERVER_URL,
  });
}
