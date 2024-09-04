import { createAuthBrowserClient } from "@template/sdk/auth/client";

import { env } from "~/env";

export function createClient() {
  return createAuthBrowserClient({
    url: env.NEXT_PUBLIC_SERVER_URL,
    logDebugMessages: false,
  });
}
