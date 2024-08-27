"use client";

import React from "react";

import { ApiClientProvider, getApiClient } from "~/store/api";

interface Props {
  children: React.ReactNode;
}

interface AppProviderProps extends Props {}

export default function AppProvider({ children }: AppProviderProps) {
  const apiClient = getApiClient();

  return <ApiClientProvider client={apiClient}>{children}</ApiClientProvider>;
}
