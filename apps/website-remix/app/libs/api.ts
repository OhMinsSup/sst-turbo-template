import { remember } from "@epic-web/remember";

import { createApiClient } from "@template/api";

import { publicConfig } from "~/config/config.public";

export const api = remember("api", () =>
  createApiClient({
    baseUrl: publicConfig.serverUrl,
  }),
);
