import { useRouteLoaderData } from "@remix-run/react";

import type { Session } from "@template/auth";

import type { RoutesLoaderData } from "~/.server/routes/root/loaders/root.loader";

function isSession(session: Session | undefined): session is Session {
  if (typeof session === "undefined") {
    return false;
  }

  return (
    typeof session === "object" &&
    "access_token" in session &&
    "refresh_token" in session &&
    "expires_at" in session
  );
}

export function useOptionalSession(): Session | undefined {
  const data = useRouteLoaderData<RoutesLoaderData>("root");
  if (!data || !isSession(data.session)) {
    return undefined;
  }
  return data.session as Session;
}

export function useSession() {
  const maybeSession = useOptionalSession();
  if (!maybeSession) {
    throw new Error(
      "No session found in root loader, but session is required by useSession. If session is optional, try useOptionalSession instead.",
    );
  }
  return maybeSession;
}
