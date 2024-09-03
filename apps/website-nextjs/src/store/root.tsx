import React from "react";
import { headers } from "next/headers";

import { ThemeProvider } from "@template/ui/theme";
import { getRequestInfo } from "@template/utils/request";

import { TRPCReactProvider } from "~/libs/trpc/react";

interface ProviderProps {
  children: React.ReactNode;
}

export default async function RootProvider({ children }: ProviderProps) {
  const { domainUrl } = getRequestInfo(headers());
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TRPCReactProvider domainUrl={domainUrl}>{children}</TRPCReactProvider>
    </ThemeProvider>
  );
}
