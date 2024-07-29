"use client";

import React from "react";

import type { UserResponse } from "@template/sdk";
import { AuthKitStatus } from "@template/authkit";
import { useRafInterval } from "@template/hooks/useRafInterval";
import { isEmpty } from "@template/utils/assertion";

import { ApiClientProvider, getApiClient } from "~/store/api";
import { useSession } from "../api/provider";

interface Props {
  children: React.ReactNode;
}

function TokenProvider({ children }: Props) {
  const session = useSession();

  const refresh = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      const data = (await response.json()) as Awaited<{
        user: UserResponse | null;
        loggedInStatus: AuthKitStatus;
      }>;

      session.setSession(data.user, data.loggedInStatus);
    } catch (error) {
      console.error(error);
    }
  };

  const updateSession = async () => {
    if (!session.user || isEmpty(session.user)) {
      return;
    }

    switch (session.loggedInStatus) {
      case AuthKitStatus.Refreshed:
      case AuthKitStatus.LoggedIn: {
        await refresh();
        return;
      }
      default: {
        return;
      }
    }
  };

  useRafInterval(updateSession, 1000 * 60 * 1);

  return <>{children}</>;
}

interface AppProviderProps extends Props {
  user?: UserResponse | null;
  loggedInStatus?: AuthKitStatus;
}

export default function AppProvider({
  children,
  user,
  loggedInStatus,
}: AppProviderProps) {
  const apiClient = getApiClient();

  return (
    <ApiClientProvider
      client={apiClient}
      user={user}
      loggedInStatus={loggedInStatus}
    >
      <TokenProvider>{children}</TokenProvider>
    </ApiClientProvider>
  );
}
