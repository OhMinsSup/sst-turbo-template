import type { ApiClient } from "@template/sdk";
import { createClient } from "@template/sdk";

const createApiClient = (options?: Parameters<typeof createClient>[1]) =>
  createClient(import.meta.env.NEXT_PUBLIC_SERVER_URL, options);

let apiClientSingleton: ApiClient | undefined = undefined;
const getApiClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createApiClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (apiClientSingleton ??= createApiClient());
  }
};

export { getApiClient, createApiClient };

getApiClient().rpc("getInfinitePost").get();
