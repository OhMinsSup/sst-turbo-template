import type { Options } from "./api/types";
import { ApiClient } from "./api/api.client.js";

const createClient = (url: string, options?: Options) => {
  return new ApiClient({
    url,
    ...options,
  });
};

export type Client = ReturnType<typeof createClient>;

export { ApiClient, createClient };
export * from "./api/types";
export * from "./api/errors";
export * from "./api/constants";
export * from "./api/schema";
