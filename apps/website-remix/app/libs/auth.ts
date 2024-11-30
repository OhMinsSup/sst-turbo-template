import { remember } from "@epic-web/remember";

import { createAuthBrowserClient } from "@template/auth/client";

import { api } from "./api";

export const remixAuthBrowser = remember("auth:browser", () =>
  createAuthBrowserClient({
    isSingleton: true,
    logDebugMessages: false,
    api,
  }),
);
