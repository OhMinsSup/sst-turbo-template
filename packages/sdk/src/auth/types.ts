import type { AppError } from "../api/errors";
import type { Options, UserResponse } from "../api/types";

export interface AuthClientOptions {
  url: string;
  logDebugMessages?: boolean;
  storage?: SupportedStorage;
  lock?: LockFunc;
  persistSession?: boolean;
  autoRefreshToken?: boolean;
  storageKey?: string;
  headers?: ResponseInit["headers"];
  apiClientOptions?: Partial<Omit<Options, "url">>;
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

export type User = Pick<UserResponse, "id" | "email" | "name" | "image">;

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
   * A timestamp of when the refresh token will expire. Returned when a login is confirmed.
   */
  refresh_token_expires_at?: number;
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
) => Promise<R>;

export interface InitializeResult {
  error: AppError | null;
}

export type CallRefreshTokenResult =
  | {
      session: Session;
      error: null;
    }
  | {
      session: null;
      error: AppError;
    };

export type AuthChangeEvent =
  | "INITIAL_SESSION"
  | "PASSWORD_RECOVERY"
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED";

export interface Subscription {
  /**
   * The subscriber UUID. This will be set by the client.
   */
  id: string;
  /**
   * The function to call every time there is an event. eg: (eventName) => {}
   */
  callback:
    | ((event: AuthChangeEvent, session: Session | null) => void)
    | ((event: AuthChangeEvent, session: Session | null) => Promise<void>);
  /**
   * Call this to remove the listener.
   */
  unsubscribe: () => void;
}

export type LoadSession =
  | {
      session: Session;
      error: null;
    }
  | {
      session: null;
      error: AppError;
    }
  | {
      session: null;
      error: null;
    };

export type GetUserResponse =
  | {
      user: UserResponse;
      error: null;
    }
  | {
      user: null;
      error: AppError;
    }
  | {
      user: null;
      error: null;
    };

export interface HandleMessageData {
  event: AuthChangeEvent;
  session: Session | null;
}
