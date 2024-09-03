import React, { useEffect } from "react";
import { SerializeFrom } from "@remix-run/node";
import { useRevalidator } from "@remix-run/react";

import { createAuthBrowserClient } from "@template/sdk/auth";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";

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

  const authClient = createRemixBrowserClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = authClient.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        revalidator.revalidate();
      }
    });

    return () => subscription.unsubscribe();
  }, [session]);

  return <>{children}</>;
}
