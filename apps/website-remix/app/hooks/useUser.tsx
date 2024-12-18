import { useRouteLoaderData } from "@remix-run/react";

import type { User } from "@template/auth";

import type { RoutesLoaderData } from "~/.server/routes/root/loaders/root.loader";

function isUser(user: User | undefined): user is User {
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
  return data.user as User;
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
