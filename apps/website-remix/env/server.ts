// server.ts
import type { RuntimeEnv } from "@veloss/vite-t3-env";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const serverEnv = (runtimeEnv: RuntimeEnv) => {
  return createEnv({
    server: {
      NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
      SESSION_SECRET: z.string().min(1),
    },
    runtimeEnv,
    skipValidation: runtimeEnv.SKIP_ENV_VALIDATION === "development",
    emptyStringAsUndefined: true,
  });
};

export type ServerEnv = ReturnType<typeof serverEnv>;
