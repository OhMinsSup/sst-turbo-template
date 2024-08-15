import React from "react";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

import type { UserResponse } from "@template/sdk";
import type { AuthKitStatus } from "@template/sdk/authkit";
import { ThemeProvider } from "@template/ui/theme";

import { AppProvider } from "~/store/app";
import { TRPCReactProvider } from "~/store/trpc/react";
import { getRequestInfo } from "~/utils/request";

interface ProviderProps {
  children: React.ReactNode;
}

export const auth = unstable_cache(
  async (headerValue: Headers) => {
    const { domainUrl } = getRequestInfo(headerValue);
    const response = await fetch(new URL("/api/auth", domainUrl), {
      method: "GET",
      headers: headerValue,
    });

    const data = (await response.json()) as Awaited<{
      user: UserResponse | null;
      loggedInStatus: AuthKitStatus;
    }>;

    return data;
  },
  ["auth_session"],
  {
    tags: ["auth"],
  },
);

export default async function RootProvider({ children }: ProviderProps) {
  const session = await auth(new Headers(headers()));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider user={session.user} loggedInStatus={session.loggedInStatus}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
