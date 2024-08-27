import type { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";

function isSession(
  session: SerializeFrom<RoutesLoaderData>["session"],
): session is SerializeFrom<RoutesLoaderData>["session"] {
  if (typeof session === "undefined" || session === null) {
    return false;
  }

  return (
    typeof session === "object" &&
    session !== null &&
    "access_token" in session &&
    "refresh_token" in session &&
    "expires_at" in session
  );
}

export function useOptionalSession() {
  const data = useRouteLoaderData<RoutesLoaderData>("root");
  if (!data || !isSession(data.session)) {
    return undefined;
  }
  return data.session;
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
