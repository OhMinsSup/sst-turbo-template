"use client";

import React from "react";

import { ApiClientProvider } from "~/store/api";
import { getApiClient } from "~/utils/api-client";

interface Props {
  children: React.ReactNode;
}

interface AppProviderProps extends Props {}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ApiClientProvider client={getApiClient()}>{children}</ApiClientProvider>
  );
}
