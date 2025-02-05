import type { AuthError } from "@veloss/error/auth";
import type { OpenApiClient } from "@veloss/openapi-builder";

import type { components, paths } from "@template/api-types";

export interface AuthClientOptions {
  logDebugMessages?: boolean;
  storage?: SupportedStorage;
  lock?: LockFunc;
  persistSession?: boolean;
  autoRefreshToken?: boolean;
  storageKey?: string;
  api: OpenApiClient<paths>;
}

type AnyFunction = (...args: any[]) => any;
type MaybePromisify<T> = T | Promise<T>;

type PromisifyMethods<T> = {
  [K in keyof T]: T[K] extends AnyFunction
    ? (...args: Parameters<T[K]>) => MaybePromisify<ReturnType<T[K]>>
    : T[K];
};

export type SupportedStorage = PromisifyMethods<
  Pick<Storage, "getItem" | "setItem" | "removeItem">
> & {
  /**
   * If set to `true` signals to the library that the storage medium is used
   * on a server and the values may not be authentic, such as reading from
   * request cookies. Implementations should not set this to true if the client
   * is used on a server that reads storage information from authenticated
   * sources, such as a secure database or file.
   */
  isServer?: boolean;
};

export type User = components["schemas"]["UserEntity"];

export interface Session {
  /**
   * The access token jwt. It is recommended to set the JWT_EXPIRY to a shorter expiry value.
   */
  access_token: string;
  /**
   * A one-time used refresh token that never expires.
   */
  refresh_token: string;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at?: number;
  /**
   * The user object.
   */
  user: User;
}

/**
 * Provide your own global lock implementation instead of the default
 * implementation. The function should acquire a lock for the duration of the
 * `fn` async function, such that no other client instances will be able to
 * hold it at the same time.
 *
 * @experimental
 *
 * @param name Name of the lock to be acquired.
 * @param acquireTimeout If negative, no timeout should occur. If positive it
 *                       should throw an Error with an `isAcquireTimeout`
 *                       property set to true if the operation fails to be
 *                       acquired after this much time (ms).
 * @param fn The operation to execute when the lock is acquired.
 */
export type LockFunc = <R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>,
  logDebugMessages?: boolean,
) => Promise<R>;

export interface InitializeResult {
  error: AuthError | undefined;
}

export type CallRefreshTokenResult =
  | {
      session: Session;
      error: undefined;
    }
  | {
      session: undefined;
      error: AuthError<TokenError>;
    };

export type AuthChangeEvent =
  | "INITIAL_SESSION"
  | "PASSWORD_RECOVERY"
  | "SIGNED_IN"
  | "SIGNED_UP"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED"
  | "SESSION_UPDATED";

export interface Subscription {
  /**
   * The subscriber UUID. This will be set by the client.
   */
  id: string;
  /**
   * The function to call every time there is an event. eg: (eventName) => {}
   */
  callback:
    | ((event: AuthChangeEvent, session: Session | undefined) => void)
    | ((event: AuthChangeEvent, session: Session | undefined) => Promise<void>);
  /**
   * Call this to remove the listener.
   */
  unsubscribe: () => void;
}

export type RefreshSession =
  | {
      user: User;
      session: Session;
      error: undefined;
    }
  | {
      user: undefined;
      session: undefined;
      error: AuthError<undefined | TokenError>;
    };

export type LoadSession =
  | {
      session: Session;
      error: undefined;
    }
  | {
      session: undefined;
      error: AuthError<undefined | TokenError>;
    }
  | {
      session: undefined;
      error: undefined;
    };

export type GetUserResponse =
  | {
      user: User;
      error: undefined;
    }
  | {
      user: undefined;
      error: AuthError<UserMeError | undefined>;
    }
  | {
      user: undefined;
      error: undefined;
    };

export interface HandleMessageData {
  event: AuthChangeEvent;
  session: Session | undefined;
}

export type MakeSessionParams =
  components["schemas"]["AuthResponseDto"]["data"];

export type RefreshSessionBody = Pick<Session, "refresh_token"> & {};

export type UpdateUserBody =
  paths["/api/v1/users"]["patch"]["requestBody"]["content"]["application/json"];

export type SignInBody =
  paths["/api/v1/auth/signIn"]["post"]["requestBody"]["content"]["application/json"];

export type SignInData =
  | paths["/api/v1/auth/signIn"]["post"]["responses"]["200"]["content"]["application/json"]
  | undefined;

export type SignInResponse =
  | {
      data: SignInData;
      session: Session;
      error: undefined;
    }
  | {
      data: undefined;
      session: undefined;
      error: AuthError<SignInError | undefined>;
    };

export type SignUpBody =
  paths["/api/v1/auth/signUp"]["post"]["requestBody"]["content"]["application/json"];

export type SignUpData =
  | paths["/api/v1/auth/signUp"]["post"]["responses"]["200"]["content"]["application/json"]
  | undefined;

export type SignUpResponse =
  | {
      data: SignUpData;
      session: Session;
      error: undefined;
    }
  | {
      data: undefined;
      session: undefined;
      error: AuthError<SignUpError | undefined>;
    };

export type TokenData =
  | paths["/api/v1/auth/token"]["post"]["responses"]["200"]["content"]["application/json"]
  | undefined;

export type TokenResponse =
  | {
      data: TokenData;
      session: Session;
      error: undefined;
    }
  | {
      data: undefined;
      session: undefined;
      error: AuthError<TokenError | undefined>;
    };

export type MeData =
  | paths["/api/v1/users/me"]["get"]["responses"]["200"]["content"]["application/json"]
  | undefined;

export interface MeResponse {
  data: MeData;
  error: AuthError<UserMeError | undefined>;
}

export interface SignOutResponse {
  error: AuthError<SignOutError | undefined> | undefined;
}

export type SignInError =
  | paths["/api/v1/auth/signIn"]["post"]["responses"]["400"]["content"]["application/json"]
  | paths["/api/v1/auth/signIn"]["post"]["responses"]["401"]["content"]["application/json"]
  | undefined;

export type SignUpError =
  | paths["/api/v1/auth/signUp"]["post"]["responses"]["400"]["content"]["application/json"]
  | paths["/api/v1/auth/signUp"]["post"]["responses"]["401"]["content"]["application/json"]
  | undefined;

export type SignOutError =
  | paths["/api/v1/auth/logout"]["post"]["responses"]["400"]["content"]["application/json"]
  | undefined;

export type UserUpdateError =
  | paths["/api/v1/users"]["patch"]["responses"]["400"]["content"]["application/json"]
  | paths["/api/v1/users"]["patch"]["responses"]["401"]["content"]["application/json"]
  | undefined;

export type UserMeError =
  | paths["/api/v1/users/me"]["get"]["responses"]["401"]["content"]["application/json"]
  | undefined;

export type TokenError =
  | paths["/api/v1/auth/token"]["post"]["responses"]["400"]["content"]["application/json"]
  | paths["/api/v1/auth/token"]["post"]["responses"]["401"]["content"]["application/json"]
  | undefined;
