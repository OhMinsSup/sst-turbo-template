import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@template/trpc/nextjs";

import { env } from "~/env";
import { getApiClient } from "~/store/api";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        cookies,
        headers: req.headers,
        client: getApiClient(),
        tokenKey: {
          accessTokenKey: env.ACCESS_TOKEN_NAME,
          refreshTokenKey: env.REFRESH_TOKEN_NAME,
        },
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
