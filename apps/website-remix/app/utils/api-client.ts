import type { ApiClient } from "@template/api";
import type { paths } from "@template/api-types";
import { createApiClient } from "@template/api";

import { publicConfig } from "~/config/config.public";

const options = {
  baseUrl: publicConfig.serverUrl,
};

let apiClientSingleton: ApiClient<paths> | undefined = undefined;
const getApiClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createApiClient(options);
  } else {
    // Browser: use singleton pattern to keep the same query client
    // @typescript-eslint/ban-ts-comment
    // @ts-expect-error - We know this is defined
    return (apiClientSingleton ??= createApiClient(options));
  }
};

export { getApiClient, createApiClient };
