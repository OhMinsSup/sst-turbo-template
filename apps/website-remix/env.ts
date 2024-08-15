import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const sharedEnv = {
  NEXT_PUBLIC_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_ACCESS_TOKEN_NAME: z
    .string()
    .min(1)
    .regex(/.*\.access_token/),
  NEXT_PUBLIC_REFRESH_TOKEN_NAME: z
    .string()
    .min(1)
    .regex(/.*\.refresh_token/),
};

export const t3EnvFn = <TPrefix extends string | undefined = "NEXT_PUBLIC_">(
  runtimeEnv: Record<string, string | boolean | number | undefined>,
  clientPrefix: TPrefix,
) =>
  createEnv<TPrefix>({
    clientPrefix,
    server: {
      NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
      SESSION_SECRET: z.string().min(1),
    },
    shared: {},
    client: {
      NEXT_PUBLIC_SERVER_URL: z.string().url(),
      NEXT_PUBLIC_ACCESS_TOKEN_NAME: z
        .string()
        .min(1)
        .regex(/.*\.access_token/),
      NEXT_PUBLIC_REFRESH_TOKEN_NAME: z
        .string()
        .min(1)
        .regex(/.*\.refresh_token/),
    },
    runtimeEnv,
    skipValidation: runtimeEnv.SKIP_ENV_VALIDATION === "development",
    emptyStringAsUndefined: true,
  });
