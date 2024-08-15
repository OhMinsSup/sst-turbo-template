import { createStore } from "zustand/vanilla";

import type { Client } from "@template/sdk";
import type { Auth } from "@template/sdk/auth";

export interface ApiClientState {
  client: Client;
  auth: Auth;
}

export type ApiClientStore = ApiClientState;

export const initApiClientStore = (
  client: Client,
  auth: Auth,
): ApiClientState => {
  return { client, auth };
};

export const createApiClientStore = (initState: ApiClientState) => {
  return createStore<ApiClientStore>()(() => ({
    ...initState,
  }));
};
