import type { AuthClientOptions, Session, User } from "./types";
import { AuthClient } from "./auth.client";

const createAuthClient = (options: AuthClientOptions) => {
  return new AuthClient(options);
};

type AuthClientType = ReturnType<typeof createAuthClient>;

export {
  AuthClient,
  createAuthClient,
  type AuthClientType,
  type Session,
  type User,
};
