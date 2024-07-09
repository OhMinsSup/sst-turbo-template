import type { Client } from "@template/sdk";
import { createStore } from "zustand/vanilla";

export interface ApiClientState {
  client: Client;
}

export type ApiClientStore = ApiClientState;

export const initApiClientStore = (client: Client): ApiClientState => {
  return { client };
};

export const createApiClientStore = (initState: ApiClientState) => {
  return createStore<ApiClientStore>()(() => ({
    ...initState,
  }));
};
