import "./polyfills.js";

import { subMinutes, toDate } from "date-fns";

import { clearCookie, setTokenCookie } from "@template/utils/cookie";
import { combineHeaders } from "@template/utils/request";

import type {
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
} from "../api/schema/index.js";
import type { AuthResponse } from "../api/types.js";
import type {
  AuthClientOptions,
  CallRefreshTokenResult,
  InitializeResult,
  LockFunc,
  Session,
  SupportedStorage,
} from "./types.js";
import { ApiClient } from "../api/api.client.js";
import { HttpResultStatus, HttpStatus } from "../api/constants/index.js";
import { createHttpError, isHttpError } from "../api/errors/index.js";
import { localStorageAdapter, memoryLocalStorageAdapter } from "./adapter.js";
import {
  AUTO_REFRESH_TICK_DURATION,
  AUTO_REFRESH_TICK_THRESHOLD,
  EXPIRY_MARGIN,
  STORAGE_KEY,
} from "./constants.js";
import {
  Deferred,
  getItemAsync,
  isBrowser,
  isSupportedNavigatorLocks,
  isSupportsLocalStorage,
  isTrusted,
  removeItemAsync,
  setItemAsync,
} from "./helper.js";
import { LockAcquireTimeoutError, lockNoOp, navigatorLock } from "./lock.js";

export class AuthClient {
  protected storageKey: string;

  protected autoRefreshToken: boolean;
  protected persistSession: boolean;
  protected storage: SupportedStorage;
  protected memoryStorage: Record<string, string> | null = null;

  protected autoRefreshTicker: ReturnType<typeof setInterval> | null = null;
  protected visibilityChangedCallback: (() => Promise<any>) | null = null;
  protected refreshingDeferred: Deferred<CallRefreshTokenResult> | null = null;

  /**
   * Keeps track of the async client initialization.
   * When null or not yet resolved the auth state is `unknown`
   * Once resolved the the auth state is known and it's save to call any further client methods.
   * Keep extra care to never reject or throw uncaught errors
   */
  protected initializePromise: Promise<InitializeResult> | null = null;

  protected api: ApiClient;
  protected lock: LockFunc;
  protected lockAcquired = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected pendingInLock: Promise<any>[] = [];

  /**
   * Used to broadcast state change events to other tabs listening.
   */
  protected broadcastChannel: BroadcastChannel | null = null;

  constructor(options: AuthClientOptions) {
    this.persistSession = options.persistSession ?? true;
    this.storageKey = options.storageKey ?? STORAGE_KEY;
    this.autoRefreshToken = isTrusted(options.autoRefreshToken);

    this.api = new ApiClient({
      url: options.url,
      ...options.apiClientOptions,
    });

    if (options.lock) {
      this.lock = options.lock;
    } else if (isSupportedNavigatorLocks()) {
      this.lock = navigatorLock;
    } else {
      this.lock = lockNoOp;
    }

    if (this.persistSession) {
      if (options.storage) {
        this.storage = options.storage;
      } else {
        if (isSupportsLocalStorage()) {
          this.storage = localStorageAdapter;
        } else {
          this.memoryStorage = {};
          this.storage = memoryLocalStorageAdapter(this.memoryStorage);
        }
      }
    } else {
      this.memoryStorage = {};
      this.storage = memoryLocalStorageAdapter(this.memoryStorage);
    }

    this.initialize();
  }

  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  async initialize(): Promise<InitializeResult> {
    if (this.initializePromise) {
      return await this.initializePromise;
    }

    this.initializePromise = (async () => {
      return await this._acquireLock(-1, async () => {
        return await this._initialize();
      });
    })();

    return await this.initializePromise;
  }

  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  private async _initialize(): Promise<InitializeResult> {
    console.log("[#_initialize()] ==>", "start");
    try {
      // no login attempt via callback url try to recover session from storage
      await this._recoverAndRefresh();
      return { error: null };
    } catch (error) {
      console.error("[#_initialize()] ==>", error);
      if (isHttpError(error)) {
        return { error };
      }

      return {
        error: createHttpError({
          message: "Failed to initialize",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: { error },
        }),
      };
    } finally {
      // await this._handleVisibilityChange();
      console.log("[#_initialize()] ==>", "end");
    }
  }

  // 회원가입
  async signUp(credentials: FormFieldSignUpSchema, throwOnError?: boolean) {
    try {
      const data = await this.api.rpc("signUp").post(credentials);

      switch (data.resultCode) {
        case HttpResultStatus.OK: {
          const session = this._makeSession(data.result);
          await this._saveSession(session);
          return { data, session: session };
        }
        default: {
          return { data, session: null };
        }
      }
    } catch (error) {
      if (typeof throwOnError === "boolean" && throwOnError) {
        throw error;
      }
      return { data: null, session: null };
    }
  }

  // 로그인
  async signIn(credentials: FormFieldSignInSchema, throwOnError?: boolean) {
    try {
      const data = await this.api.rpc("signIn").post(credentials);

      switch (data.resultCode) {
        case HttpResultStatus.OK: {
          const session = this._makeSession(data.result);
          await this._saveSession(session);
          return { data, session };
        }
        default: {
          return { data, session: null };
        }
      }
    } catch (error) {
      if (typeof throwOnError === "boolean" && throwOnError) {
        throw error;
      }
      return { data: null, session: null };
    }
  }

  // 인증 응답값을 세션값으로 변경
  private _makeSession(data: AuthResponse) {
    const {
      tokens: { accessToken, refreshToken },
      ...user
    } = data;

    return {
      access_token: accessToken.token,
      refresh_token: refreshToken.token,
      expires_in: subMinutes(accessToken.expiresAt, 5).getTime(),
      expires_at: toDate(accessToken.expiresAt).getTime(),
      refresh_token_expires_at: toDate(refreshToken.expiresAt).getTime(),
      user,
    } as Session;
  }

  // 스토리지 저장
  private async _saveSession(session: Session) {
    console.log("[#_saveSession()] ==>", session);
    await setItemAsync(this.storage, this.storageKey, session);
  }

  // 스토리지 삭제
  private async _removeSession() {
    console.log("[#_removeSession()]");
    await removeItemAsync(this.storage, this.storageKey);
  }

  /**
   * Acquires a global lock based on the storage key.
   */
  private async _acquireLock<R>(
    acquireTimeout: number,
    fn: () => Promise<R>,
  ): Promise<R> {
    try {
      if (this.lockAcquired) {
        const last = this.pendingInLock.length
          ? this.pendingInLock.at(-1)
          : Promise.resolve();

        const result = (async () => {
          if (typeof last === "undefined") {
            // skip
          } else {
            await last;
          }
          return await fn();
        })();

        this.pendingInLock.push(
          (async () => {
            try {
              await result;
            } catch (e) {
              // we just care if it finished
              console.error(e);
            }
          })(),
        );

        return result;
      }

      return await this.lock(
        `lock:${this.storageKey}`,
        acquireTimeout,
        async () => {
          try {
            this.lockAcquired = true;

            const result = fn();

            this.pendingInLock.push(
              (async () => {
                try {
                  await result;
                } catch (e) {
                  // we just care if it finished
                  console.error(e);
                }
              })(),
            );

            await result;

            // keep draining the queue until there's nothing to wait on
            while (this.pendingInLock.length) {
              const waitOn = [...this.pendingInLock];

              await Promise.all(waitOn);

              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              this.pendingInLock.splice(0, waitOn.length);
            }

            return await result;
          } finally {
            this.lockAcquired = false;
          }
        },
      );
    } finally {
      // empty
    }
  }

  /**
   * Recovers the session from LocalStorage and refreshes
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  private async _recoverAndRefresh() {
    try {
      const currentSession = await getItemAsync(this.storage, this.storageKey);
      console.log("currentSession", currentSession);

      if (!this._isValidSession(currentSession)) {
        console.log("currentSession is not valid");
        if (currentSession !== null) {
          console.log("currentSession is not null");
          await this._removeSession();
        }
        return;
      }

      const timeNow = Math.round(Date.now() / 1000);
      console.log("timeNow", timeNow);
      const expiresWithMargin =
        (currentSession.expires_at ?? Infinity) < timeNow + EXPIRY_MARGIN;
      console.log("expiresWithMargin", expiresWithMargin);

      if (expiresWithMargin) {
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const { error } = await this._callRefreshToken(
            currentSession.refresh_token,
          );

          if (error) {
            console.error(error);
            await this._removeSession();
          }
        }
      } else {
        // empty the session if it's expired
      }
    } catch (err) {
      // empty
      console.error(err);
      return;
    } finally {
      // empty
    }
  }

  private async _callRefreshToken(
    refreshToken: string,
  ): Promise<CallRefreshTokenResult> {
    if (!refreshToken) {
      throw createHttpError({
        message: "Refresh token is missing",
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    // refreshing is already in progress
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }

    try {
      this.refreshingDeferred = new Deferred<CallRefreshTokenResult>();

      const { session, data } = await this._refreshAccessToken(
        refreshToken,
        true,
      );

      if (!session) {
        throw createHttpError({
          message: "Failed to refresh token",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      await this._saveSession(session);

      const result = { session, error: null };

      this.refreshingDeferred.resolve(result);

      return result;
    } catch (error) {
      if (isHttpError(error)) {
        const result = { session: null, error: error as Error };

        await this._removeSession();

        this.refreshingDeferred?.resolve(result);

        return result;
      }

      this.refreshingDeferred?.reject(error);
      throw error;
    } finally {
      this.refreshingDeferred = null;
    }
  }

  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  private async _refreshAccessToken(
    refreshToken: string,
    throwOnError?: boolean,
  ) {
    try {
      const response = await this.api.rpc("refresh").patch({ refreshToken });

      switch (response.resultCode) {
        case HttpResultStatus.OK: {
          const session = this._makeSession(response.result);
          return { data: response, session: session };
        }
        default: {
          return { data: response, session: null };
        }
      }
    } catch (error) {
      if (typeof throwOnError === "boolean" && throwOnError) {
        throw error;
      }
      return { data: null, session: null };
    }
  }

  private _isValidSession(maybeSession: unknown): maybeSession is Session {
    const isValidSession =
      typeof maybeSession === "object" &&
      maybeSession !== null &&
      "access_token" in maybeSession &&
      "refresh_token" in maybeSession &&
      "expires_at" in maybeSession;

    return isValidSession;
  }

  // /**
  //  * Registers callbacks on the browser / platform, which in-turn run
  //  * algorithms when the browser window/tab are in foreground. On non-browser
  //  * platforms it assumes always foreground.
  //  */
  // private async _handleVisibilityChange() {
  //   if (!isBrowser() || !window?.addEventListener) {
  //     if (this.autoRefreshToken) {
  //       // in non-browser environments the refresh token ticker runs always
  //       this.startAutoRefresh();
  //     }

  //     return false;
  //   }

  //   try {
  //     this.visibilityChangedCallback = async () =>
  //       await this._onVisibilityChanged(false);

  //     window?.addEventListener(
  //       "visibilitychange",
  //       this.visibilityChangedCallback,
  //     );

  //     // now immediately call the visbility changed callback to setup with the
  //     // current visbility state
  //     await this._onVisibilityChanged(true); // initial call
  //   } catch (error) {
  //     console.error("_handleVisibilityChange", error);
  //   }
  // }

  // /**
  //  * Callback registered with `window.addEventListener('visibilitychange')`.
  //  */
  // private async _onVisibilityChanged(calledFromInitialize: boolean) {
  //   if (document.visibilityState === "visible") {
  //     if (this.autoRefreshToken) {
  //       // in browser environments the refresh token ticker runs only on focused tabs
  //       // which prevents race conditions
  //       this._startAutoRefresh();
  //     }

  //     if (!calledFromInitialize) {
  //       // called when the visibility has changed, i.e. the browser
  //       // transitioned from hidden -> visible so we need to see if the session
  //       // should be recovered immediately... but to do that we need to acquire
  //       // the lock first asynchronously
  //       await this.initializePromise;

  //       await this._acquireLock(-1, async () => {
  //         if (document.visibilityState !== "visible") {
  //           // visibility has changed while waiting for the lock, abort
  //           return;
  //         }

  //         // recover the session
  //         await this._recoverAndRefresh();
  //       });
  //     }
  //   } else if (document.visibilityState === "hidden") {
  //     if (this.autoRefreshToken) {
  //       this._stopAutoRefresh();
  //     }
  //   }
  // }

  // /**
  //  * This is the private implementation of {@link #startAutoRefresh}. Use this
  //  * within the library.
  //  */
  // private async _startAutoRefresh() {
  //   await this._stopAutoRefresh();

  //   const ticker = setInterval(
  //     () => this._autoRefreshTokenTick(),
  //     AUTO_REFRESH_TICK_DURATION,
  //   );
  //   this.autoRefreshTicker = ticker;

  //   if (
  //     ticker &&
  //     typeof ticker === "object" &&
  //     typeof ticker.unref === "function"
  //   ) {
  //     // ticker is a NodeJS Timeout object that has an `unref` method
  //     // https://nodejs.org/api/timers.html#timeoutunref
  //     // When auto refresh is used in NodeJS (like for testing) the
  //     // `setInterval` is preventing the process from being marked as
  //     // finished and tests run endlessly. This can be prevented by calling
  //     // `unref()` on the returned object.
  //     ticker.unref();
  //     // @ts-ignore
  //   }

  //   // run the tick immediately, but in the next pass of the event loop so that
  //   // #_initialize can be allowed to complete without recursively waiting on
  //   // itself
  //   setTimeout(async () => {
  //     await this.initializePromise;
  //     await this._autoRefreshTokenTick();
  //   }, 0);
  // }

  // /**
  //  * This is the private implementation of {@link #stopAutoRefresh}. Use this
  //  * within the library.
  //  */
  // private async _stopAutoRefresh() {
  //   const ticker = this.autoRefreshTicker;
  //   this.autoRefreshTicker = null;

  //   if (ticker) {
  //     clearInterval(ticker);
  //   }
  // }

  // /**
  //  * Starts an auto-refresh process in the background. The session is checked
  //  * every few seconds. Close to the time of expiration a process is started to
  //  * refresh the session. If refreshing fails it will be retried for as long as
  //  * necessary.
  //  *
  //  * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
  //  * to call this function, it will be called for you.
  //  *
  //  * On browsers the refresh process works only when the tab/window is in the
  //  * foreground to conserve resources as well as prevent race conditions and
  //  * flooding auth with requests. If you call this method any managed
  //  * visibility change callback will be removed and you must manage visibility
  //  * changes on your own.
  //  *
  //  * On non-browser platforms the refresh process works *continuously* in the
  //  * background, which may not be desirable. You should hook into your
  //  * platform's foreground indication mechanism and call these methods
  //  * appropriately to conserve resources.
  //  *
  //  * {@see #stopAutoRefresh}
  //  */
  // async startAutoRefresh() {
  //   this._removeVisibilityChangedCallback();
  //   await this._startAutoRefresh();
  // }

  // /**
  //  * Stops an active auto refresh process running in the background (if any).
  //  *
  //  * If you call this method any managed visibility change callback will be
  //  * removed and you must manage visibility changes on your own.
  //  *
  //  * See {@link #startAutoRefresh} for more details.
  //  */
  // async stopAutoRefresh() {
  //   this._removeVisibilityChangedCallback();
  //   await this._stopAutoRefresh();
  // }

  // /**
  //  * Removes any registered visibilitychange callback.
  //  *
  //  * {@see #startAutoRefresh}
  //  * {@see #stopAutoRefresh}
  //  */
  // private _removeVisibilityChangedCallback() {
  //   const callback = this.visibilityChangedCallback;
  //   this.visibilityChangedCallback = null;

  //   try {
  //     if (callback && isBrowser() && window?.removeEventListener) {
  //       window.removeEventListener("visibilitychange", callback);
  //     }
  //   } catch (e) {
  //     console.error("removing visibilitychange callback failed", e);
  //   }
  // }

  // private async __useSession() {}

  // /**
  //  * Runs the auto refresh token tick.
  //  */
  // private async _autoRefreshTokenTick() {
  //   try {
  //     await this._acquireLock(0, async () => {
  //       try {
  //         const now = Date.now();

  //         try {
  //           return await this._useSession(async (result) => {
  //             const {
  //               data: { session },
  //             } = result;

  //             if (!session?.refresh_token || !session.expires_at) {
  //               return;
  //             }

  //             // session will expire in this many ticks (or has already expired if <= 0)
  //             const expiresInTicks = Math.floor(
  //               (session.expires_at * 1000 - now) / AUTO_REFRESH_TICK_DURATION,
  //             );

  //             if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
  //               await this._callRefreshToken(session.refresh_token);
  //             }
  //           });
  //         } catch (e: any) {
  //           console.error(
  //             "Auto refresh tick failed with error. This is likely a transient error.",
  //             e,
  //           );
  //         }
  //       } finally {
  //         // empty
  //       }
  //     });
  //   } catch (e: any) {
  //     if (e.isAcquireTimeout || e instanceof LockAcquireTimeoutError) {
  //       console.error(
  //         "Auto refresh tick failed to acquire lock. This is likely a transient error.",
  //         e,
  //       );
  //     } else {
  //       throw e;
  //     }
  //   }
  // }

  // /**
  //  * NEVER USE DIRECTLY!
  //  *
  //  * Always use {@link #_useSession}.
  //  */
  // private async __loadSession(): Promise<
  //   | {
  //       data: {
  //         session: Session;
  //       };
  //       error: null;
  //     }
  //   | {
  //       data: {
  //         session: null;
  //       };
  //       error: Error;
  //     }
  //   | {
  //       data: {
  //         session: null;
  //       };
  //       error: null;
  //     }
  // > {
  //   if (!this.lockAcquired) {
  //     // empry
  //   }

  //   try {
  //     let currentSession: Session | null = null;

  //     const maybeSession = await getItemAsync(this.storage, this.storageKey);

  //     if (maybeSession !== null) {
  //       if (this._isValidSession(maybeSession)) {
  //         currentSession = maybeSession;
  //       } else {
  //         await this._removeSession();
  //       }
  //     }

  //     if (!currentSession) {
  //       return { data: { session: null }, error: null };
  //     }

  //     const hasExpired = currentSession.expires_at
  //       ? currentSession.expires_at <= Date.now() / 1000
  //       : false;

  //     if (!hasExpired) {
  //       if (this.storage.isServer) {
  //         let suppressWarning = this.suppressGetSessionWarning;
  //         const proxySession: Session = new Proxy(currentSession, {
  //           get: (target: any, prop: string, receiver: any) => {
  //             if (!suppressWarning && prop === "user") {
  //               // only show warning when the user object is being accessed from the server
  //               console.warn(
  //                 "Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and many not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.",
  //               );
  //               suppressWarning = true; // keeps this proxy instance from logging additional warnings
  //               this.suppressGetSessionWarning = true; // keeps this client's future proxy instances from warning
  //             }
  //             return Reflect.get(target, prop, receiver);
  //           },
  //         });
  //         currentSession = proxySession;
  //       }

  //       return { data: { session: currentSession }, error: null };
  //     }

  //     const { session, error } = await this._callRefreshToken(
  //       currentSession.refresh_token,
  //     );
  //     if (error) {
  //       return { data: { session: null }, error };
  //     }

  //     return { data: { session }, error: null };
  //   } finally {
  //     // empty
  //   }
  // }
}
