"use client";

import React from "react";

import { ApiClientProvider } from "./api";
import { getApiClient } from "./api-client";
import TokenProvider from "./token";

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
