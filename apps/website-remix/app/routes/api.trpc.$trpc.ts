import type { LoaderFunction } from "@remix-run/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "~/.server/trpc";

export const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: request,
    createContext: ({ resHeaders, req }) =>
      createTRPCContext({
        resHeaders,
        request: req,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

export const loader: LoaderFunction = ({ request }) => handler(request);

export const action = loader;
