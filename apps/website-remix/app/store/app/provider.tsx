import React, { useEffect } from "react";
import { SerializeFrom } from "@remix-run/node";
import { useRevalidator } from "@remix-run/react";

import { createAuthBrowserClient } from "@template/sdk/auth";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { ApiClientProvider } from "~/store/api";
import { getApiClient } from "~/utils/api-client";

export const createRemixBrowserClient = () => {
  return createAuthBrowserClient({
    isSingleton: true,
    logDebugMessages: false,
    url: import.meta.env.NEXT_PUBLIC_SERVER_URL,
  });
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
