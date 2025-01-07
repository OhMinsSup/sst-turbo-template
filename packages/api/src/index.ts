import type { MediaType } from "openapi-typescript-helpers";

import type { DefaultOpenApiPaths } from "@template/api-fetch";
import type { paths } from "@template/api-types";

import type { ApiClientOptions } from "./types";
import { ApiClient } from "./api.client";

/**
 * @description API Client 인스턴스를 생성합니다.
 * @param {ApiClientOptions<Paths>} options
 * @returns {ApiClient<Paths>}
 */
const createApiClient = <
  Paths extends DefaultOpenApiPaths,
  Media extends MediaType = MediaType,
>(
  options?: ApiClientOptions<Paths>,
): ApiClient<Paths, Media> => {
  return new ApiClient<Paths, Media>(options);
};

const api = createApiClient<paths>();

export { createApiClient, ApiClient };
