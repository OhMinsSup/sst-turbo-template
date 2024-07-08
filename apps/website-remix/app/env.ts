import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const t3EnvFn = (
  runtimeEnv: Record<string, string | boolean | number | undefined>,
) =>
  createEnv({
    clientPrefix: "NEXT_PUBLIC_",
    server: {
      AUTH_SECRET:
        runtimeEnv.NODE_ENV === "production"
          ? z.string().min(1)
          : z.string().min(1).optional(),
      NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    },
    client: {
      NEXT_PUBLIC_SERVER_URL: z.string().url(),
    },
    runtimeEnv: runtimeEnv,
    skipValidation: runtimeEnv.SKIP_ENV_VALIDATION === "development",
    emptyStringAsUndefined: true,
  });
