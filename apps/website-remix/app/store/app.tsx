import type { Client } from "@template/sdk";
import React from "react";

import { createClient } from "@template/sdk";

import { ApiClientProvider } from "./api-client-provider";
import TokenProvider from "./token";

export const createApiClient = (options?: Parameters<typeof createClient>[1]) =>
  createClient(import.meta.env.NEXT_PUBLIC_SERVER_URL, options);

let apiClientSingleton: Client | undefined = undefined;
const getApiClient = () => {
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

  return (
    <ApiClientProvider client={apiClient}>
      <TokenProvider>{children}</TokenProvider>
    </ApiClientProvider>
  );
}
