import { remember } from "@epic-web/remember";

import type { paths } from "@template/api-types";
import { createApiClient } from "@template/api";

import { publicConfig } from "~/config/config.public";

export const api = remember("api", () =>
  createApiClient<paths>({
    defaults: {
      baseUrl: publicConfig.serverUrl,
    },
  }),
);
