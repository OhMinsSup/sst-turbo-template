// client.ts
import type { RuntimeEnv } from "@veloss/vite-t3-env";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = (
  runtimeEnv: RuntimeEnv,
  clientPrefix: string | undefined,
) => {
  return createEnv({
    clientPrefix,
    client: {
      NEXT_PUBLIC_SERVER_URL: z.string().url(),
    },
    runtimeEnv,
    skipValidation: runtimeEnv.SKIP_ENV_VALIDATION === "development",
    emptyStringAsUndefined: true,
  });
};

export type ClientEnv = ReturnType<typeof clientEnv>;
