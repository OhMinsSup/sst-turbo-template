import type { LoaderFunction } from "@remix-run/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { privateConfig } from "~/config/config.private";
import { getApiClient } from "~/store/app";
import { appRouter, createTRPCContext } from "~/trpc";

export const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: request,
    createContext: ({ req }) => {
      return createTRPCContext({
        request: req,
        client: getApiClient(),
        tokenKey: privateConfig.token,
      });
    },
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

export const loader: LoaderFunction = ({ request }) => handler(request);

export const action = loader;
