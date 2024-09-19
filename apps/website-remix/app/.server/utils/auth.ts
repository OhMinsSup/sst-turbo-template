import { redirect } from "@remix-run/node";

import { createHttpError, HttpStatus } from "@template/sdk";
import {
  createAuthServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@template/sdk/auth/server";

interface CreateRemixServerClientOptions {
  headers: Headers;
  request: Request;
}

export const createRemixServerClient = ({
  request,
  headers,
}: CreateRemixServerClientOptions) => {
  return createAuthServerClient({
    url: import.meta.env.NEXT_PUBLIC_SERVER_URL,
    logDebugMessages: false,
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    },
  });
};

export type AuthRemixServerClient = ReturnType<typeof createRemixServerClient>;

export async function getUserId(client: AuthRemixServerClient) {
  const { session } = await client.getSession();
  if (!session) {
    return null;
  }

  const { user } = await client.getUser();
  if (!user) {
    await client.signOut();

    throw createHttpError({
      statusMessage: "Unauthorized",
      statusCode: HttpStatus.UNAUTHORIZED,
      data: "Unauthorized",
    });
  }

  return user.id;
}

export async function requireAnonymous(client: AuthRemixServerClient) {
  const userId = await getUserId(client);
  if (userId) {
    throw redirect("/");
  }
}

export async function requireUserId(params: {
  redirectTo?: string | null;
  request: Request;
  client: AuthRemixServerClient;
}) {
  const userId = await getUserId(params.client);
  if (!userId) {
    const requestUrl = new URL(params.request.url);
    params.redirectTo =
      params.redirectTo === null
        ? null
        : (params.redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`);
    const loginParams = params.redirectTo
      ? new URLSearchParams({ redirectTo: params.redirectTo })
      : null;
    const loginRedirect = ["/signin", loginParams?.toString()]
      .filter(Boolean)
      .join("?");
    throw redirect(loginRedirect);
  }
  return userId;
}
