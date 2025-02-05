import type {
  AuthClientOptions,
  Session,
  SignInError,
  SignOutError,
  SignUpError,
  TokenError,
  User,
  UserMeError,
  UserUpdateError,
} from "./types";
import { AuthClient } from "./auth";

const createAuthClient = (options: AuthClientOptions) => {
  return new AuthClient(options);
};

type AuthClientType = ReturnType<typeof createAuthClient>;

export {
  AuthClient,
  createAuthClient,
  type AuthClientOptions,
  type AuthClientType,
  type Session,
  type User,
  type SignInError,
  type SignUpError,
  type SignOutError,
  type UserUpdateError,
  type UserMeError,
  type TokenError,
};
