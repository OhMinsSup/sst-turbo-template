import "./utils/polyfills";

import { addSeconds, isBefore, subMinutes, toDate } from "date-fns";

import {
  isBrowser,
  isNullOrUndefined,
  isPromiseLike,
  isTrusted,
} from "@template/utils/assertion";

import type { AppError } from "../api/errors";
import type {
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
} from "../api/schema";
import type { AuthResponse } from "../api/types";
import type {
  AuthChangeEvent,
  AuthClientOptions,
  CallRefreshTokenResult,
  GetUserResponse,
  InitializeResult,
  LoadSession,
  LockFunc,
  Session,
  Subscription,
  SupportedStorage,
} from "./types";
import { HttpResultStatus, HttpStatus } from "../api/constants";
import {
  createAppError,
  isAppError,
  isFetchError,
  isHttpError,
} from "../api/errors";
import { localStorageAdapter } from "./adapters/local";
import { memoryLocalStorageAdapter } from "./adapters/memory";
import {
  AUTO_REFRESH_TICK_DURATION,
  AUTO_REFRESH_TICK_THRESHOLD,
  EXPIRY_MARGIN,
  STORAGE_KEY,
} from "./constants";
import { Core } from "./core";
import { Deferred } from "./utils/deferred";
import {
  getItemAsync,
  isSupportedNavigatorLocks,
  isSupportsLocalStorage,
  removeItemAsync,
  setItemAsync,
  uuid,
} from "./utils/helper";
import { LockAcquireTimeoutError, lockNoOp, navigatorLock } from "./utils/lock";

export class AuthClient extends Core {
  protected storageKey: string;

  protected autoRefreshToken: boolean;
  protected persistSession: boolean;
  protected storage: SupportedStorage;
  protected memoryStorage: Record<string, string> | null = null;

  protected stateChangeEmitters = new Map<string, Subscription>();
  protected autoRefreshTicker: ReturnType<typeof setInterval> | null = null;
  protected visibilityChangedCallback: (() => Promise<unknown>) | null = null;
  protected refreshingDeferred: Deferred<CallRefreshTokenResult> | null = null;

  protected initializePromise: Promise<InitializeResult> | null = null;
  protected suppressGetSessionWarning = false;

  protected lock: LockFunc;
  protected lockAcquired = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected pendingInLock: Promise<any>[] = [];

  protected broadcastChannel: BroadcastChannel | null = null;

  constructor(options: AuthClientOptions) {
    super({
      logDebugMessages: options.logDebugMessages,
      url: options.url,
      apiClientOptions: options.apiClientOptions,
    });
    this.persistSession = options.persistSession ?? true;
    this.storageKey = options.storageKey ?? STORAGE_KEY;
    this.autoRefreshToken = isTrusted(options.autoRefreshToken);

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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.initialize();
  }

  // 클라이언트 세션을 초기화
  async initialize(): Promise<InitializeResult> {
    if (this.initializePromise) {
      return this.initializePromise;
    }

    this.initializePromise = this._acquireLock(-1, async () => {
      return this._initialize();
    });

    return this.initializePromise;
  }

  // 이 코드는 _initialize 메서드를 정의하고 있으며, 클라이언트 세션을 초기화하는 역할을 합니다.
  // 이 메서드는 생성자에서 호출되므로 예외를 던지지 않도록 주의해야 하며, 세션을 반환하지 않아야 합니다.
  private async _initialize(): Promise<InitializeResult> {
    const debugName = "[#_initialize()] ==>";
    this.debug(debugName, "start");
    try {
      await this._recoverAndRefresh();
      return { error: null };
    } catch (error) {
      if (isAppError(error)) {
        return { error };
      }

      return {
        error: createAppError({
          message: "Failed to initialize",
          data: error,
        }),
      };
    } finally {
      await this._handleVisibilityChange();
      this.debug(debugName, "end");
    }
  }

  // 클라이언트 저장소에 저장된 세션 정보
  async getSession() {
    if (this.initializePromise) {
      await this.initializePromise;
    }

    const result = await this._acquireLock(-1, () => {
      // eslint-disable-next-line @typescript-eslint/require-await
      return this._useSession(async (result) => result);
    });

    return result;
  }

  // 회원가입
  async signUp(credentials: FormFieldSignUpSchema, throwOnError?: boolean) {
    try {
      const data = await this.api.rpc("signUp").post(credentials);

      switch (data.resultCode) {
        case HttpResultStatus.OK: {
          const session = this._makeSession(data.result);
          await this._saveSession(session);
          await this._notifyAllSubscribers("SIGNED_IN", session);
          return { data, session: session, error: null };
        }
        default: {
          return {
            data,
            session: null,
            error: createAppError({
              message: "Failed to sign up",
              data,
            }),
          };
        }
      }
    } catch (error) {
      if (typeof throwOnError === "boolean" && throwOnError) {
        throw error;
      }
      return {
        data: null,
        session: null,
        error: isAppError(error)
          ? error
          : createAppError({
              message: "Failed to sign up",
              data: error,
            }),
      };
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
          await this._notifyAllSubscribers("SIGNED_IN", session);
          return { data, session, error: null };
        }
        default: {
          return {
            data,
            session: null,
            error: createAppError({
              message: "Failed to sign in",
              data,
            }),
          };
        }
      }
    } catch (error) {
      if (typeof throwOnError === "boolean" && throwOnError) {
        throw error;
      }
      return {
        data: null,
        session: null,
        error: isAppError(error)
          ? error
          : createAppError({ message: "Failed to sign in", data: error }),
      };
    }
  }

  // 내 정보 가져오기
  async getUser(jwt?: string): Promise<GetUserResponse> {
    if (jwt) {
      return await this._getUser(jwt);
    }

    if (this.initializePromise) {
      await this.initializePromise;
    }

    const result = await this._acquireLock(-1, async () => {
      return await this._getUser();
    });

    return result;
  }

  // 로그아웃
  async signOut(): Promise<{ error: AppError | null }> {
    if (this.initializePromise) {
      await this.initializePromise;
    }

    return await this._acquireLock(-1, async () => {
      return await this._signOut();
    });
  }

  // 토큰을 통해서 유저 정보 가져오기
  private async _getUser(jwt?: string): Promise<GetUserResponse> {
    try {
      if (jwt) {
        const data = await this.api.rpc("me").setAuthToken(jwt).get();
        return {
          user: data as unknown as GetUserResponse["user"],
          error: null,
        };
      }

      return await this._useSession(async (result) => {
        const { session, error } = result;
        if (error) {
          throw error;
        }

        // returns an error if there is no access_token or custom authorization header
        if (!session?.access_token) {
          return {
            user: null,
            error: createAppError({
              message: "No access token found",
              data: "AUTH_SESSION_MISSING_ACCESS_TOKEN",
            }),
          };
        }

        const data = await this.api
          .rpc("me")
          .setAuthToken(session.access_token)
          .get();

        return {
          user: data as unknown as GetUserResponse["user"],
          error: null,
        };
      });
    } catch (error) {
      if (isAppError(error)) {
        if (error.data === "AUTH_SESSION_MISSING_ACCESS_TOKEN") {
          await this._removeSession();
          await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        return { user: null, error };
      }

      throw error;
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
    this.debug("[#_saveSession()] ==>", session);
    await setItemAsync(this.storage, this.storageKey, session);
  }

  // 스토리지 삭제
  private async _removeSession() {
    this.debug("[#_removeSession()]");
    await removeItemAsync(this.storage, this.storageKey);
  }

  // 잠금을 획득된 상태에서 추가적인 비동기 작업을 수행하기 위해 사용
  private async _waitForLockRelease<R>(fn: () => Promise<R>) {
    const debugName = "[#_waitForLockRelease()] ==>";
    const last = this.pendingInLock.length
      ? (this.pendingInLock.at(-1) ?? Promise.resolve())
      : Promise.resolve();

    const result = last.then(() => fn());

    const pendingFn = (async () => {
      try {
        await result;
      } catch (e) {
        // we just care if it finished
        this.error(debugName, e);
      }
    })();

    this.pendingInLock.push(pendingFn);

    return result;
  }

  // 스토리지 키를 이용해서 전역 잠금을 건다.
  private async _acquireLock<R>(
    acquireTimeout: number,
    fn: () => Promise<R>,
  ): Promise<R> {
    const debugName = "[#_acquireLock()] ==>";

    try {
      if (this.lockAcquired) {
        return this._waitForLockRelease(fn);
      }

      return await this.lock(
        `lock:${this.storageKey}`,
        acquireTimeout,
        async () => {
          this.debug(
            debugName,
            "lock acquired for storage key",
            this.storageKey,
          );

          try {
            this.lockAcquired = true;

            const result = fn();

            const pendingFn = (async () => {
              try {
                await result;
              } catch (e) {
                // we just care if it finished
                this.error(debugName, e);
              }
            })();

            this.pendingInLock.push(pendingFn);

            await result;

            // 기다릴 것이 없을 때까지 대기열을 계속 비움
            while (this.pendingInLock.length) {
              const waitOn = [...this.pendingInLock];

              await Promise.all(waitOn);

              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              this.pendingInLock.splice(0, waitOn.length);
            }

            return await result;
          } finally {
            this.debug(
              debugName,
              "lock released for storage key",
              this.storageKey,
            );

            this.lockAcquired = false;
          }
        },
      );
    } finally {
      this.debug(debugName, "end");
    }
  }

  private async _signOut(): Promise<{ error: AppError | null }> {
    return await this._useSession(async (result) => {
      const { session, error: sessionError } = result;
      if (sessionError) {
        return { error: sessionError };
      }
      const accessToken = session?.access_token;

      let error: AppError | null = null;
      if (accessToken) {
        try {
          await this.api.rpc("signOut").post({ accessToken });
        } catch (e) {
          this.error("[#_signOut()] ==> signOut error", e);
          error = isFetchError(e)
            ? createAppError({
                message: "Failed to sign out",
                data: e,
              })
            : isAppError(e)
              ? e
              : createAppError({ message: "Failed to sign out" });
        }
      }

      await this._removeSession();
      await this._notifyAllSubscribers("SIGNED_OUT", null);

      return { error };
    });
  }

  private async _recoverAndRefresh() {
    const debugName = "[#_recoverAndRefresh()] ==>";
    this.debug(debugName, "begin");

    try {
      const currentSession = await getItemAsync(this.storage, this.storageKey);
      this.debug(debugName, "session from storage", currentSession);

      if (!this._isValidSession(currentSession)) {
        this.debug(debugName, "session is not valid");
        if (currentSession !== null) {
          await this._removeSession();
        }
        return;
      }

      const timeNow = Date.now();
      const expiresAt = currentSession.expires_at
        ? currentSession.expires_at
        : Infinity;
      const expiresWithMargin =
        expiresAt < addSeconds(timeNow, EXPIRY_MARGIN).getTime();

      this.debug(
        debugName,
        `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN}s`,
      );

      if (expiresWithMargin) {
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const { error } = await this._callRefreshToken(
            currentSession.refresh_token,
          );

          if (error) {
            this.error(debugName, error);
            await this._removeSession();
          }
        }
      } else {
        await this._notifyAllSubscribers("SIGNED_IN", currentSession);
      }
    } catch (err) {
      // empty
      this.error(debugName, err);
      return;
    } finally {
      this.debug(debugName, "end");
    }
  }

  private async _callRefreshToken(
    refreshToken: string,
  ): Promise<CallRefreshTokenResult> {
    if (!refreshToken) {
      throw createAppError({
        message: "Refresh token is missing",
      });
    }

    // refreshing is already in progress
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }

    const debugName = `[#_callRefreshToken(${refreshToken.substring(0, 5)}...)] ==>`;

    this.debug(debugName, "begin");

    try {
      this.refreshingDeferred = new Deferred<CallRefreshTokenResult>();

      const { session } = await this._refreshAccessToken(refreshToken, true);
      if (!session) {
        throw createAppError({
          message: "Failed to refresh token",
        });
      }

      await this._saveSession(session);
      await this._notifyAllSubscribers("TOKEN_REFRESHED", session);

      const result = { session, error: null };

      this.refreshingDeferred.resolve(result);

      return result;
    } catch (error) {
      this.error(debugName, error);
      if (isAppError(error)) {
        const result = { session: null, error };

        await this._removeSession();

        this.refreshingDeferred?.resolve(result);

        return result;
      }

      this.refreshingDeferred?.reject(error);
      throw error;
    } finally {
      this.refreshingDeferred = null;
      this.debug(debugName, "end");
    }
  }

  private async _refreshAccessToken(
    refreshToken: string,
    throwOnError?: boolean,
  ) {
    try {
      const data = await this.api.rpc("refresh").patch({ refreshToken });

      switch (data.resultCode) {
        case HttpResultStatus.OK: {
          const session = this._makeSession(data.result);
          return { data, session, error: null };
        }
        default: {
          return {
            data,
            session: null,
            error: createAppError({
              message: "Failed to refresh token",
              data,
            }),
          };
        }
      }
    } catch (error) {
      if (typeof throwOnError === "boolean" && throwOnError) {
        throw error;
      }
      return {
        data: null,
        session: null,
        error: isAppError(error)
          ? error
          : createAppError({ message: "Failed to refresh token", data: error }),
      };
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

  onAuthStateChange(
    callback: (
      event: AuthChangeEvent,
      session: Session | null,
    ) => void | Promise<void>,
  ) {
    const debugName = "[#onAuthStateChange()] ==>";
    this.debug(debugName, "begin");

    const id: string = uuid();
    const subscription: Subscription = {
      id,
      callback,
      unsubscribe: () => {
        this.debug(
          debugName,
          "unsubscribe() - state change callback with id removed",
          id,
        );
        this.stateChangeEmitters.delete(id);
      },
    };

    this.debug(debugName, "registered callback with id", id);

    this.stateChangeEmitters.set(id, subscription);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      if (this.initializePromise) {
        await this.initializePromise;
      }

      // eslint-disable-next-line @typescript-eslint/require-await
      await this._acquireLock(-1, async () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._emitInitialSession(id);
      });
    })();

    return { data: { subscription } };
  }

  private async _notifyAllSubscribers(
    event: AuthChangeEvent,
    session: Session | null,
    broadcast = true,
  ) {
    const debugName = `[#_notifyAllSubscribers(${event})] ==>`;
    this.debug(debugName, "begin", session, `broadcast = ${broadcast}`);

    try {
      if (this.broadcastChannel && broadcast) {
        this.broadcastChannel.postMessage({ event, session });
      }

      const errors: Error[] = [];
      const promises = Array.from(this.stateChangeEmitters.values()).map(
        async (x) => {
          try {
            if (isPromiseLike<void>(x.callback)) {
              await x.callback(event, session);
            } else {
              void x.callback(event, session);
            }
          } catch (e) {
            if (e instanceof Error) {
              errors.push(e);
            }
          }
        },
      );

      await Promise.all(promises);

      if (errors.length > 0) {
        for (const error of errors) {
          this.error(error);
        }

        const firstError = errors.at(0);
        if (firstError) {
          throw firstError;
        }
      }
    } finally {
      this.debug(debugName, "end");
    }
  }

  private async _useSession<R>(
    fn: (result: LoadSession) => Promise<R>,
  ): Promise<R> {
    const debugName = "[#_useSession()] ==>";
    this.debug(debugName, "begin");

    try {
      const result = await this.__loadSession();

      return await fn(result);
    } finally {
      this.debug(debugName, "end");
    }
  }

  private async __loadSession(): Promise<LoadSession> {
    const debugName = "[#__loadSession()] ==>";
    this.debug(debugName, "begin");

    if (!this.lockAcquired) {
      this.debug(
        debugName,
        "used outside of an acquired lock!",
        new Error().stack,
      );
    }

    try {
      let currentSession: Session | null = null;

      const maybeSession = await getItemAsync(this.storage, this.storageKey);

      if (maybeSession !== null) {
        if (this._isValidSession(maybeSession)) {
          currentSession = maybeSession;
        } else {
          await this._removeSession();
        }
      }

      if (!currentSession) {
        return { session: null, error: null };
      }

      const hasExpired = currentSession.expires_at
        ? isBefore(currentSession.expires_at, new Date())
        : false;

      this.debug(
        debugName,
        `session has${hasExpired ? "" : " not"} expired`,
        "expires_at",
        currentSession.expires_at,
      );

      if (!hasExpired) {
        return { session: currentSession, error: null };
      }

      const { session, error } = await this._callRefreshToken(
        currentSession.refresh_token,
      );
      if (error) {
        return { session: null, error };
      }

      return { session, error: null };
    } finally {
      this.debug(debugName, "end");
    }
  }

  private async _handleVisibilityChange() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!isBrowser() || !window.addEventListener) {
      if (this.autoRefreshToken) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.startAutoRefresh();
      }

      return false;
    }

    try {
      this.visibilityChangedCallback = async () =>
        await this._onVisibilityChanged(false);

      window.addEventListener(
        "visibilitychange",
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.visibilityChangedCallback,
      );

      // now immediately call the visbility changed callback to setup with the
      // current visbility state
      await this._onVisibilityChanged(true); // initial call
    } catch (error) {
      this.error("_handleVisibilityChange", error);
    }
  }

  private async _onVisibilityChanged(calledFromInitialize: boolean) {
    const methodName = `[#_onVisibilityChanged(${calledFromInitialize})] ==>`;
    this.debug(methodName, "visibilityState", document.visibilityState);

    if (document.visibilityState === "visible") {
      if (this.autoRefreshToken) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._startAutoRefresh();
      }

      if (!calledFromInitialize) {
        if (this.initializePromise) {
          await this.initializePromise;
        }

        await this._acquireLock(-1, async () => {
          if (document.visibilityState !== "visible") {
            this.debug(
              methodName,
              "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting",
            );

            // visibility has changed while waiting for the lock, abort
            return;
          }

          // recover the session
          await this._recoverAndRefresh();
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (document.visibilityState === "hidden") {
      if (this.autoRefreshToken) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._stopAutoRefresh();
      }
    }
  }

  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  private async _startAutoRefresh() {
    await this._stopAutoRefresh();

    const ticker = setInterval(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      () => this._autoRefreshTokenTick(),
      AUTO_REFRESH_TICK_DURATION,
    );
    this.autoRefreshTicker = ticker;

    if (
      !isNullOrUndefined(ticker) &&
      typeof ticker === "object" &&
      typeof ticker.unref === "function"
    ) {
      // https://nodejs.org/api/timers.html#timeoutunref
      ticker.unref();
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      await this.initializePromise;
      await this._autoRefreshTokenTick();
    }, 0);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async _stopAutoRefresh() {
    const ticker = this.autoRefreshTicker;
    this.autoRefreshTicker = null;

    if (ticker) {
      clearInterval(ticker);
    }
  }

  async startAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._startAutoRefresh();
  }

  async stopAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
  }

  private _removeVisibilityChangedCallback() {
    const callback = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (callback && isBrowser() && window.removeEventListener) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        window.removeEventListener("visibilitychange", callback);
      }
    } catch (e) {
      console.error("removing visibilitychange callback failed", e);
    }
  }

  private async _autoRefreshTokenTick() {
    const debugName = "[#_autoRefreshTokenTick()] ==>";
    try {
      await this._acquireLock(0, async () => {
        try {
          try {
            return await this._useSession(async (result) => {
              const { session } = result;

              if (!session?.refresh_token || !session.expires_at) {
                this.debug(debugName, "no session");
                return;
              }

              const timeNow = Date.now();
              const expiresAt = session.expires_at ? session.expires_at : 0;
              const expiresIn = expiresAt - timeNow;

              // session will expire in this many ticks (or has already expired if <= 0)
              const expiresInTicks = Math.floor(
                expiresIn / AUTO_REFRESH_TICK_DURATION,
              );

              this.debug(
                debugName,
                `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`,
              );

              if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                await this._callRefreshToken(session.refresh_token);
              }
            });
          } catch (e) {
            this.error(
              "Auto refresh tick failed with error. This is likely a transient error.",
              e,
            );
          }
        } finally {
          // empty
          this.debug(debugName, "end");
        }
      });
    } catch (e) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (e as LockAcquireTimeoutError).isAcquireTimeout ||
        e instanceof LockAcquireTimeoutError
      ) {
        this.debug(debugName, "auto refresh token tick lock not available");
      } else {
        throw e;
      }
    }
  }

  private async _emitInitialSession(id: string): Promise<void> {
    return await this._useSession(async (result) => {
      try {
        const { session, error } = result;
        if (error) throw error;

        await this.stateChangeEmitters
          .get(id)
          ?.callback("INITIAL_SESSION", session);
        this.debug("INITIAL_SESSION", "callback id", id, "session", session);
      } catch (err) {
        await this.stateChangeEmitters
          .get(id)
          ?.callback("INITIAL_SESSION", null);
        this.debug("INITIAL_SESSION", "callback id", id, "error", err);
        this.error(err);
      }
    });
  }
}

export const createAuthClient = (options: AuthClientOptions) => {
  return new AuthClient(options);
};
