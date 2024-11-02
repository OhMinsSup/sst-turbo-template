import type { paths } from "@template/api-types";

import type { ApiClientOptions } from "./types";
import { ApiClient } from "./api.client";

/**
 * @description API Client 인스턴스를 생성합니다.
 * @param {ApiClientOptions<Paths>} options
 * @returns {ApiClient<Paths>}
 */
const createApiClient = <Paths extends paths>(
  options?: ApiClientOptions<Paths>,
): ApiClient<Paths> => {
  return new ApiClient<Paths>(options);
};

export { createApiClient, ApiClient };
