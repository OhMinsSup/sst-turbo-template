import { redirect } from "@remix-run/node";

import type { AuthClient, Session, User } from "@template/auth";
import { remixAuth } from "@template/auth/remix";

import { publicConfig } from "~/config/config.public";
import { getApiClient } from "~/utils/api-client";

export const auth = remixAuth({
  baseURL: publicConfig.serverUrl,
  api: getApiClient(),
  debug: false,
});

export async function getUserId(client: AuthClient) {
  const { session } = await client.getSession();
  if (!session) {
    return null;
  }

  const { user } = await client.getUser();
  if (!user) {
    return null;
  }

  return user.id;
}

export async function requireAnonymous(client: AuthClient) {
  const userId = await getUserId(client);
  if (userId) {
    throw redirect("/");
  }
}

export async function requireUserId(params: {
  redirectTo?: string | null;
  request: Request;
  client: AuthClient;
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

export interface UserAndSession {
  session: Session | undefined;
  user: User | undefined;
}

export async function getSession(client: AuthClient) {
  return await client.getSession();
}

export async function getUser(client: AuthClient) {
  return await client.getUser();
}

export async function getUserAndSession(
  client: AuthClient,
): Promise<UserAndSession> {
  const { session, error: sessionError } = await getSession(client);
  if (sessionError || !session) {
    return {
      session: undefined,
      user: undefined,
    };
  }

  const { user, error: userError } = await getUser(client);
  if (userError || !user) {
    return {
      session,
      user: undefined,
    };
  }

  return {
    session,
    user,
  };
}
