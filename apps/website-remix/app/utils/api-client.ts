import type { ApiClient } from "@template/api";
import type { paths } from "@template/api-types";
import { createApiClient } from "@template/api";

import { publicConfig } from "~/config/config.public";

let apiClientSingleton: ApiClient<paths> | undefined = undefined;
const getApiClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createApiClient({
      baseUrl: publicConfig.serverUrl,
    });
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (apiClientSingleton ??= createApiClient());
  }
};

export { getApiClient, createApiClient };
