import type { AuthClientOptions } from "./types";
import { AuthClient } from "./client";
import { createAuthBrowserClient } from "./createAuthBrowserClient";
import { createAuthServerClient } from "./createAuthServerClient";

const createAuthClient = (options: AuthClientOptions) => {
  return new AuthClient(options);
};

export type Auth = ReturnType<typeof createAuthClient>;

export {
  AuthClient,
  createAuthClient,
  createAuthServerClient,
  createAuthBrowserClient,
};
export * from "./types";
