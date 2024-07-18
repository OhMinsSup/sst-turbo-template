import React from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { AuthKitStatus } from "@template/authkit";
import { useRafInterval } from "@template/hooks/useRafInterval";
import { isEmpty } from "@template/utils/assertion";

import type { RoutesActionData } from "~/.server/routes/root/root.action";
import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";

interface TokenProviderProps {
  children: React.ReactNode;
}

export default function TokenProvider({ children }: TokenProviderProps) {
  const data = useLoaderData<RoutesLoaderData>();
  const fetcher = useFetcher<RoutesActionData>();

  const updateSession = () => {
    if (isEmpty(data)) {
      return;
    }

    switch (data.loggedInStatus) {
      case AuthKitStatus.Refreshed:
      case AuthKitStatus.LoggedIn: {
        fetcher.submit("?/refresh", { method: "post" });
        return;
      }
      default: {
        return;
      }
    }
  };

  useRafInterval(
    () => updateSession(),
    // 1분
    1000 * 60 * 1,
  );

  return <>{children}</>;
}
