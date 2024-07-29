import { cache } from "react";
import { cookies, headers } from "next/headers";

import { createCaller, createTRPCContext } from "@template/trpc/nextjs";

import { env } from "~/env";
import { getApiClient } from "~/store/api";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    cookies: cookies,
    headers: heads,
    client: getApiClient(),
    tokenKey: {
      accessTokenKey: env.ACCESS_TOKEN_NAME,
      refreshTokenKey: env.REFRESH_TOKEN_NAME,
    },
  });
});

export const api = createCaller(createContext);
