import type { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";

function isUser(
  user: SerializeFrom<RoutesLoaderData>["user"],
): user is SerializeFrom<RoutesLoaderData>["user"] {
  if (typeof user === "undefined") {
    return false;
  }

  return typeof user === "object" && typeof user.id === "string";
}

export function useOptionalUser() {
  const data = useRouteLoaderData<RoutesLoaderData>("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}
