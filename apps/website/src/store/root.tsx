import React from "react";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@template/ui/theme";

import { auth } from "~/auth";
import { AppProvider } from "~/store/app";
import { TRPCReactProvider } from "~/store/trpc/react";

interface ProviderProps {
  children: React.ReactNode;
}

export default async function RootProvider({ children }: ProviderProps) {
  const session = await auth();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <AppProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </AppProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
