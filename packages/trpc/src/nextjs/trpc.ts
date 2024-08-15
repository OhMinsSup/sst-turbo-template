/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import type { cookies } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { AuthResponse, Client } from "@template/sdk";
import type { AuthKitTokenKey } from "@template/sdk/authkit";
import {
  AuthKit,
  AuthKitFramework,
  AuthKitStatus,
} from "@template/sdk/authkit";

export interface Session {
  user: Pick<AuthResponse, "email" | "id" | "image" | "name"> & {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
  };
  error?:
    | "RefreshAccessTokenError"
    | "MissingRefreshToken"
    | "InvalidRefreshToken";
}

interface NextjsTRPCContext {
  headers: Headers;
  cookies: typeof cookies;
  client: Client;
  tokenKey: AuthKitTokenKey;
}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: NextjsTRPCContext) => {
  const { cookies, headers, client, tokenKey } = opts;
  const source = headers.get("x-trpc-source") ?? "unknown";

  const authKit = new AuthKit({
    client,
    tokenKey,
    headers,
  });

  const cookie = headers.get("cookie");

  const { user, status, tokens } = await authKit.checkAuth(
    cookie ? authKit.getTokens(cookie, AuthKitFramework.Next) : null,
  );

  if (
    tokens &&
    [AuthKitStatus.LoggedIn, AuthKitStatus.Refreshed].includes(status)
  ) {
    cookies().set(tokenKey.accessTokenKey, tokens.accessToken.token, {
      httpOnly: true,
      expires: new Date(tokens.accessToken.expiresAt),
      path: "/",
      sameSite: "lax",
    });
    cookies().set(tokenKey.refreshTokenKey, tokens.refreshToken.token, {
      httpOnly: true,
      expires: new Date(tokens.refreshToken.expiresAt),
      path: "/",
      sameSite: "lax",
    });
  }

  console.log(">>> tRPC Request Nextjs from", source);

  return {
    headers,
    cookies,
    session: user,
    status,
    authKit,
    client,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});
