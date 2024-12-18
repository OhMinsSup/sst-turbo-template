import { remixAuth } from "@template/auth/remix";

import { publicConfig } from "~/config/config.public";
import { api } from "~/libs/api";

export const auth = remixAuth({
  baseURL: publicConfig.serverUrl,
  debug: false,
  api,
});
