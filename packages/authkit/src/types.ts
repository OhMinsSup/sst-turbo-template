import type { Client, TokenResponse, UserResponse } from "@template/sdk";

export interface AuthKitTokenKey {
  accessTokenKey: string;
  refreshTokenKey: string;
}

export interface AuthKitConstructorOptions {
  client: Client;
  tokenKey: AuthKitTokenKey;
  headers?: Headers;
}

export interface AuthKitParams {
  accessToken?: string | null;
  refreshToken?: string | null;
}

export interface AuthKitValidateAuthParams {
  accessToken: string;
  refreshToken?: string | null;
}

export enum AuthKitStatus {
  LoggedIn = "action:loggedIn",
  NotLogin = "action:notLogin",
  Invalid = "action:invalidToken",
  Refreshed = "action:refreshed",
  Error = "action:error",
}

export enum AuthKitFramework {
  None = "none",
  Next = "next",
  SvelteKit = "sveltekit",
  Remix = "remix",
}

export type AuthKitReturnValue<
  S extends AuthKitStatus = AuthKitStatus.NotLogin,
> = S extends AuthKitStatus.LoggedIn
  ? {
      status: AuthKitStatus.LoggedIn;
      user: UserResponse;
      tokens: TokenResponse;
      headers: Headers;
    }
  : S extends AuthKitStatus.NotLogin
    ? {
        status: AuthKitStatus.NotLogin;
        user: null;
        tokens: null;
        headers: Headers;
      }
    : S extends AuthKitStatus.Invalid
      ? {
          status: AuthKitStatus.Invalid;
          user: null;
          tokens: null;
          headers: Headers;
        }
      : S extends AuthKitStatus.Refreshed
        ? {
            status: AuthKitStatus.Refreshed;
            user: UserResponse;
            tokens: TokenResponse;
            headers: Headers;
          }
        : S extends AuthKitStatus.Error
          ? {
              status: AuthKitStatus.Error;
              user: null;
              tokens: null;
              headers: Headers;
            }
          : never;

// ------------------------------
