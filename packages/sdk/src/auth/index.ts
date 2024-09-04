import { AuthClient, createAuthClient } from "./client";

export type Auth = ReturnType<typeof createAuthClient>;

export { AuthClient, createAuthClient };
export * from "./types";
