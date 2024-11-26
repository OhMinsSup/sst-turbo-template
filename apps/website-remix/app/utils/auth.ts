import { createAuthBrowserClient } from "@template/auth/client";

import { getApiClient } from "./api-client";

export const createRemixBrowserClient = () => {
  return createAuthBrowserClient({
    isSingleton: true,
    logDebugMessages: false,
    api: getApiClient(),
  });
};
