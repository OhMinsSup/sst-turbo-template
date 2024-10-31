import type { paths } from "@template/api-types";

import type { ApiClientOptions } from "./types";
import { ApiClient } from "./api.client";

const createApiClient = <Paths extends paths>(
  options?: ApiClientOptions<Paths>,
) => {
  return new ApiClient<Paths>(options);
};

export { createApiClient, ApiClient };
