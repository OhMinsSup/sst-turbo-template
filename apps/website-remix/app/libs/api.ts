import { remember } from "@epic-web/remember";
import { createOpenApiBuilder } from "@veloss/openapi-builder";

import type { paths } from "@template/api-types";

import { publicConfig } from "~/config/config.public";

export const api = remember("api", () =>
  createOpenApiBuilder<paths>({
    base: publicConfig.serverUrl,
  }),
);
