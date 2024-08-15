import { createStore } from "zustand/vanilla";

import type { Client, UserResponse } from "@template/sdk";
import type { AuthKitStatus } from "@template/sdk/authkit";

export interface ApiClientState {
  client: Client;
  user: UserResponse | null;
  loggedInStatus: AuthKitStatus;
}

export interface ApiClientActions {
  setSession: (user: UserResponse | null, status: AuthKitStatus) => void;
  setUser: (user: UserResponse | null) => void;
  setLoggedInStatus: (status: AuthKitStatus) => void;
}

export type ApiClientStore = ApiClientState & ApiClientActions;

export const initApiClientStore = (state: ApiClientState): ApiClientState => {
  return state;
};

export const createApiClientStore = (initState: ApiClientState) => {
  return createStore<ApiClientStore>()((set) => ({
    ...initState,
    setSession: (user, status) => set({ user, loggedInStatus: status }),
    setUser: (user) => set({ user }),
    setLoggedInStatus: (status) => set({ loggedInStatus: status }),
  }));
};
