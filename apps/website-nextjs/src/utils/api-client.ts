import type { ApiClient } from "@template/api";
import type { paths } from "@template/api-types";
import { createApiClient } from "@template/api";

import { env } from "~/env";

let apiClientSingleton: ApiClient<paths> | undefined = undefined;
const getApiClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createApiClient({
      baseUrl: env.NEXT_PUBLIC_SERVER_URL,
    });
  } else {
    // Browser: use singleton pattern to keep the same query client
    // @ts-expect-error - This is a singleton pattern
    return (apiClientSingleton ??= createApiClient({
      baseUrl: env.NEXT_PUBLIC_SERVER_URL,
    }));
  }
};

export { getApiClient, createApiClient };
