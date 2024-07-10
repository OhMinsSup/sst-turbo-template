import React from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";

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

  console.log("[TokenProvider] fetcher", fetcher);

  const updateSession = () => {
    console.log("[updateSession] call", data);
    if (isEmpty(data)) {
      return;
    }

    switch (data.loggedInStatus) {
      case "action:loggedIn":
      case "action:refreshed":
      case "action:notLogin": {
        return;
      }
      default: {
        fetcher.submit("/?refresh", { method: "post" });
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
