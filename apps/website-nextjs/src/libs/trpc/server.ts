import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "@template/trpc";
import { createCaller, createTRPCContext } from "@template/trpc";

import { createClient } from "~/libs/auth/server";
import { getApiClient } from "~/utils/api-client";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  const client = createClient();

  const data = await client.getSession();

  return createTRPCContext({
    session: data.session,
    headers: heads,
    client: getApiClient(),
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
