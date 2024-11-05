import { createAuthBrowserClient } from "@template/auth/client";

import { getApiClient } from "~/utils/api-client";

export function createClient() {
  return createAuthBrowserClient({
    api: getApiClient(),
    logDebugMessages: false,
  });
}
