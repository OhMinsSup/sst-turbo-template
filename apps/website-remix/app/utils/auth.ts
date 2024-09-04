import { createAuthBrowserClient } from "@template/sdk/auth/client";

export const createRemixBrowserClient = () => {
  return createAuthBrowserClient({
    isSingleton: true,
    logDebugMessages: false,
    url: import.meta.env.NEXT_PUBLIC_SERVER_URL,
  });
};
