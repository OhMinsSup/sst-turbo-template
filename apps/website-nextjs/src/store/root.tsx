import React from "react";

import { ThemeProvider } from "@template/ui/theme";

import { TRPCReactProvider } from "~/libs/trpc/react";
import { AppProvider } from "~/store/app";

interface ProviderProps {
  children: React.ReactNode;
}

export default async function RootProvider({ children }: ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
