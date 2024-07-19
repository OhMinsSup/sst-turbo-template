import React from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";

import type { Client } from "@template/sdk";
import { AuthKitStatus } from "@template/authkit";
import { useRafInterval } from "@template/hooks/useRafInterval";
import { createClient } from "@template/sdk";
import { isEmpty } from "@template/utils/assertion";

import type { RoutesActionData } from "~/.server/routes/root/root.action";
import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { ApiClientProvider } from "../api/provider";

export const createApiClient = (options?: Parameters<typeof createClient>[1]) =>
  createClient(import.meta.env.NEXT_PUBLIC_SERVER_URL, options);

let apiClientSingleton: Client | undefined = undefined;
export const getApiClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createApiClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (apiClientSingleton ??= createApiClient());
  }
};

interface Props {
  children: React.ReactNode;
}

export default function AppProvider({ children }: Props) {
  const apiClient = getApiClient();

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

  return <ApiClientProvider client={apiClient}>{children}</ApiClientProvider>;
}
