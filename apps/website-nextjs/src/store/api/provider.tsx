"use client";

import type { ReactNode } from "react";
import type { StoreApi } from "zustand";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { Client, UserResponse } from "@template/sdk";
import { AuthKitStatus } from "@template/authkit";

import type { ApiClientStore } from "./store";
import { createApiClientStore, initApiClientStore } from "./store";

export const ApiClientContext = createContext<StoreApi<ApiClientStore> | null>(
  null,
);

export interface Props {
  client: Client;
  user?: UserResponse | null;
  loggedInStatus?: AuthKitStatus;
  children: ReactNode;
}

export const ApiClientProvider = ({
  children,
  client,
  user,
  loggedInStatus,
}: Props) => {
  const storeRef = useRef<StoreApi<ApiClientStore>>();
  if (!storeRef.current) {
    storeRef.current = createApiClientStore(
      initApiClientStore({
        client,
        user: user ?? null,
        loggedInStatus: loggedInStatus ?? AuthKitStatus.NotLogin,
      }),
    );
  }

  return (
    <ApiClientContext.Provider value={storeRef.current}>
      {children}
    </ApiClientContext.Provider>
  );
};

export const useApiClientStore = <T,>(
  selector: (store: ApiClientStore) => T,
): T => {
  const context = useContext(ApiClientContext);

  if (!context) {
    throw new Error(`useApiClientStore must be use within ApiClientProvider`);
  }

  return useStore(context, selector);
};

export const useApiClient = () => {
  return useApiClientStore((state) => state.client);
};

export const useSession = () => {
  return useApiClientStore((state) => ({
    user: state.user,
    loggedInStatus: state.loggedInStatus,
    setSession: state.setSession,
  }));
};

export const useLoggedInStatus = () => {
  return useApiClientStore((state) => ({
    status: state.loggedInStatus,
    setLoggedInStatus: state.setLoggedInStatus,
  }));
};

export const useUser = () => {
  return useApiClientStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
};
