import React, { useEffect } from "react";
import { SerializeFrom } from "@remix-run/node";
import { useRevalidator } from "@remix-run/react";

import type { Client } from "@template/sdk";
import { createClient } from "@template/sdk";
import { createAuthBrowserClient } from "@template/sdk/auth";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { ApiClientProvider } from "~/store/api";

export const createRemixBrowserClient = () => {
  return createAuthBrowserClient({
    isSingleton: true,
    logDebugMessages: false,
    url: import.meta.env.NEXT_PUBLIC_SERVER_URL,
  });
};

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
  session?: SerializeFrom<RoutesLoaderData>["session"];
  children: React.ReactNode;
}

export default function AppProvider({ children, session }: Props) {
  const revalidator = useRevalidator();
  const apiClient = getApiClient();

  const authClient = createRemixBrowserClient();

  useEffect(() => {
    console.log("Auth state changed effect", session);
    const {
      data: { subscription },
    } = authClient.onAuthStateChange((_, newSession) => {
      console.log("Auth state changed start", newSession, session);
      if (newSession?.expires_at !== session?.expires_at) {
        console.log("Session changed");
        // TODO: Invalidate
        revalidator.revalidate();
      }
      console.log("Auth state changed done");
    });

    return () => subscription.unsubscribe();
  }, [session]);

  return <ApiClientProvider client={apiClient}>{children}</ApiClientProvider>;
}
