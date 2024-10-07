import type { FetchError } from "ofetch";
import { addSeconds, isBefore, subMinutes, toDate } from "date-fns";

import {
  isBrowser,
  isNullOrUndefined,
  isPromiseLike,
  isTrusted,
} from "@template/utils/assertion";

import type { HttpError } from "../api/errors";
import type {
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
} from "../api/schema";
import type { ApiBuilderReturnValue, AuthResponse } from "../api/types";
import type {
  AuthChangeEvent,
  AuthClientOptions,
  CallRefreshTokenResult,
  GetUserResponse,
  HandleMessageData,
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
  createHttpError,
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
  isSupportedBroadcastChannel,
  isSupportedNavigatorLocks,
  isSupportsLocalStorage,
  removeItemAsync,
  setItemAsync,
  uuid,
} from "./utils/helper";
import { LockAcquireTimeoutError, lockNoOp, navigatorLock } from "./utils/lock";
import { polyfillGlobalThis } from "./utils/polyfills";

polyfillGlobalThis();

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

    if (
      isSupportedBroadcastChannel() &&
      this.persistSession &&
      this.storageKey
    ) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(
          this.storageKey,
        );
      } catch (e) {
        this.error(
          "Failed to create a new BroadcastChannel, multi-tab state changes will not be available",
          e,
        );
      }

      this.broadcastChannel?.addEventListener(
        "message",
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this._handleMessage.bind(this),
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.initialize();
  }

  /**
   * 클라이언트 세션을 초기화합니다. 이 메서드는 세션을 복구하고 갱신하는 역할을 합니다.
   */
  async initialize(): Promise<InitializeResult> {
    // 이미 초기화가 진행 중이라면, 해당 프로미스를 반환합니다.
    if (this.initializePromise) {
      return this.initializePromise;
    }

    // 초기화 프로미스를 생성하고, 잠금을 획득하여 초기화를 진행합니다.
    this.initializePromise = this._acquireLock(-1, async () => {
      return this._initialize();
    });

    // 초기화 프로미스가 완료되면, 초기화 프로미스를 반환합니다.
    return this.initializePromise;
  }

  /**
   * 클라이언트 세션 초기화
   * 1. 메서드는 생성자에서 호출되므로 예외를 던지지 않도록 주의
   * 2. 캐시에 저장되므로 이 메서드에서 세션을 반환하지 않아야 함
   */
  private async _initialize(): Promise<InitializeResult> {
    const debugName = "[#_initialize()] ==>";
    this.debug(debugName, "start");
    try {
      await this._recoverAndRefresh();
      return { error: null };
    } catch (error) {
      if (isHttpError(error) || isFetchError(error)) {
        return { error };
      }

      return {
        error: createHttpError({
          statusMessage: "Internal Server Error",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to initialize",
          data: error,
        }),
      };
    } finally {
      await this._handleVisibilityChange();
      this.debug(debugName, "end");
    }
  }

  /**
   * 클라이언트 저장소에 저장된 세션 정보
   */
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

  /**
   * 회원가입
   * @param {FormFieldSignUpSchema} credentials - 회원가입 정보
   * @param {boolean?} throwOnError - 에러 발생 시 예외를 던질지 여부
   */
  async signUp(credentials: FormFieldSignUpSchema, throwOnError?: boolean) {
    try {
      // 인증요청
      const data = await this.api
        .rpc("signUp")
        .post()
        .setSafeBody(credentials)
        .run();

      switch (data.resultCode) {
        case HttpResultStatus.OK: {
          // 세션 객체 생성
          const session = this._makeSession(data.result);
          // 세션 객체 스토리지에 저장
          await this._saveSession(session);
          // 로그인에 대한 이벤트 등록
          await this._notifyAllSubscribers("SIGNED_IN", session);
          return { data, session: session, error: null };
        }
        default: {
          return {
            data,
            session: null,
            error: null,
          };
        }
      }
    } catch (error) {
      if (typeof throwOnError === "boolean" && throwOnError) {
        throw error;
      }

      // HTTP 에러나 Fetch 에러가 발생했을 때
      if (
        isHttpError<ApiBuilderReturnValue<"signUp", "POST">>(error) ||
        isFetchError<ApiBuilderReturnValue<"signUp", "POST">>(error)
      ) {
        return {
          data: null,
          session: null,
          error,
        };
      }

      // 그 외의 에러가 발생했을 때
      return {
        data: null,
        session: null,
        error: createHttpError({
          statusMessage: "Internal Server Error",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to sign up",
          data: error,
        }),
      };
    }
  }

  /**
   * 로그인
   * @param {FormFieldSignInSchema} credentials - 로그인 정보
   * @param {boolean?} throwOnError - 에러 발생 시 예외를 던질지 여부
   */
  async signIn(credentials: FormFieldSignInSchema, throwOnError?: boolean) {
    try {
      // 인증요청
      const data = await this.api
        .rpc("signIn")
        .post()
        .setSafeBody(credentials)
        .run();

      switch (data.resultCode) {
        case HttpResultStatus.OK: {
          // 세션 객체 생성
          const session = this._makeSession(data.result);
          // 세션 객체 스토리지에 저장
          await this._saveSession(session);
          // 로그인에 대한 이벤트 등록
          await this._notifyAllSubscribers("SIGNED_IN", session);
          return { data, session, error: null };
        }
        default: {
          return {
            data,
            session: null,
            error: null,
          };
        }
      }
    } catch (error) {
      if (typeof throwOnError === "boolean" && throwOnError) {
        throw error;
      }

      // HTTP 에러나 Fetch 에러가 발생했을 때
      if (
        isHttpError<ApiBuilderReturnValue<"signIn", "POST">>(error) ||
        isFetchError<ApiBuilderReturnValue<"signIn", "POST">>(error)
      ) {
        return {
          data: null,
          session: null,
          error,
        };
      }

      return {
        data: null,
        session: null,
        error: createHttpError({
          statusMessage: "Internal Server Error",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to sign in",
          data: error,
        }),
      };
    }
  }

  /**
   * 토큰을 이용해서 유저 정보 가져오기
   * @param {string?} jwt - JWT 토큰
   */
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

  /**
   * 로그아웃
   */
  async signOut(): Promise<{ error: HttpError | FetchError | null }> {
    if (this.initializePromise) {
      await this.initializePromise;
    }

    return await this._acquireLock(-1, async () => {
      return await this._signOut();
    });
  }

  /**
   * 토큰을 통해서 유저 정보 가져오기
   * @param {string?} jwt - JWT 토큰
   */
  private async _getUser(jwt?: string): Promise<GetUserResponse> {
    try {
      // 토큰이 존재한다면, 토큰을 이용해서 유저 정보를 가져옵니다.
      if (jwt) {
        const data = await this.api.rpc("me").setAuthToken(jwt).get().run();
        return {
          user: data.result,
          error: null,
        };
      }

      // 유저 정보를 가져오기 위해 세션을 이용합니다.
      return await this._useSession(async (result) => {
        const { session, error } = result;
        if (error) {
          throw error;
        }

        // 세션이 없다면, 에러를 발생시킵니다.
        if (!session?.access_token) {
          return {
            user: null,
            error: createHttpError({
              statusMessage: "Unauthorized",
              statusCode: HttpStatus.UNAUTHORIZED,
              message: "No access token found",
              data: "AUTH_SESSION_MISSING_ACCESS_TOKEN",
            }),
          };
        }

        // 유저 정보를 가져옵니다.
        const data = await this.api
          .rpc("me")
          .setAuthToken(session.access_token)
          .get()
          .run();

        return {
          user: data.result,
          error: null,
        };
      });
    } catch (error) {
      if (isHttpError(error) || isFetchError(error)) {
        await this._removeSession();
        await this._notifyAllSubscribers("SIGNED_OUT", null);

        return { user: null, error };
      }

      throw error;
    }
  }

  /**
   * 인증 응답값을 세션값으로 변경
   * @param {AuthResponse} data - 인증 응답값
   */
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

  /**
   * 스토리지 저장
   * @param {Session} session - 세션 객체
   */
  private async _saveSession(session: Session) {
    this.debug("[#_saveSession()] ==>", session);
    await setItemAsync(this.storage, this.storageKey, session);
  }

  /**
   * 스트리지 삭제
   */
  private async _removeSession() {
    this.debug("[#_removeSession()]");
    await removeItemAsync(this.storage, this.storageKey);
  }

  /**
   * 잠금을 획득된 상태에서 추가적인 비동기 작업을 수행하기 위해 사용
   * @param {Function} fn - 비동기 작업 함수
   */
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

  /**
   * 스토리지 키를 이용해서 전역 잠금을 건다.
   * @param {number} acquireTimeout - 잠금 획득 시간
   * @param {Function} fn - 잠금 획득 후 실행할 함수
   */
  private async _acquireLock<R>(
    acquireTimeout: number,
    fn: () => Promise<R>,
  ): Promise<R> {
    const debugName = "[#_acquireLock()] ==>";

    try {
      // 잠금을 획득하고, 잠금이 해제될 때까지 대기합니다.
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

  /**
   * 로그아웃
   */
  private async _signOut(): Promise<{ error: HttpError | FetchError | null }> {
    return await this._useSession(async (result) => {
      const { session, error: sessionError } = result;
      if (sessionError) {
        return { error: sessionError };
      }
      const accessToken = session?.access_token;

      let error: FetchError | HttpError | null = null;
      // 토큰이 있다면 로그아웃 요청
      if (accessToken) {
        try {
          await this.api
            .rpc("signOut")
            .post()
            .setSafeBody({ accessToken })
            .run();
        } catch (e) {
          this.error("[#_signOut()] ==> signOut error", e);

          // HTTP 에러나 Fetch 에러가 발생했을 때
          if (isHttpError(e) || isFetchError(e)) {
            error = e;
          } else {
            error = createHttpError({
              statusMessage: "Internal Server Error",
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: "Failed to sign out",
              data: e as Error,
            });
          }
        }
      }

      // 실패해도 세션 삭제
      await this._removeSession();
      // 로그아웃에 대한 이벤트 등록
      await this._notifyAllSubscribers("SIGNED_OUT", null);

      return { error };
    });
  }

  /**
   * 세션을 복구하고 갱신합니다.
   */
  private async _recoverAndRefresh() {
    const debugName = "[#_recoverAndRefresh()] ==>";
    this.debug(debugName, "begin");

    try {
      // 현재 스토리지에 저장된 세션을 가져옵니다.
      const currentSession = await getItemAsync(this.storage, this.storageKey);
      this.debug(debugName, "session from storage", currentSession);

      // 해당 세션이 유효하지 않다면, 세션을 삭제합니다.
      if (!this._isValidSession(currentSession)) {
        this.debug(debugName, "session is not valid");
        if (currentSession !== null) {
          // 세션을 삭제합니다.
          await this._removeSession();
        }
        return;
      }

      const timeNow = Date.now();
      const expiresAt = currentSession.expires_at
        ? currentSession.expires_at
        : Infinity;

      // 세션의 만료 시간이 현재 시간보다 작다면, 세션을 삭제합니다.
      const expiresWithMargin =
        expiresAt < addSeconds(timeNow, EXPIRY_MARGIN).getTime();

      this.debug(
        debugName,
        `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN}s`,
      );

      // 세션이 만료되었을 때
      if (expiresWithMargin) {
        // 자동 갱신이 활성화되어 있다면, 토큰을 갱신합니다.
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const { error } = await this._callRefreshToken(
            currentSession.refresh_token,
          );

          // 에러 상태면 세션을 삭제합니다.
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

  /**
   * 토큰 갱신 요청
   * @param {string?} refreshToken - 갱신 토큰
   */
  private async _callRefreshToken(
    refreshToken?: string,
  ): Promise<CallRefreshTokenResult> {
    // 갱신 토큰이 없다면, 에러를 발생시킵니다.
    if (!refreshToken) {
      throw createHttpError({
        statusMessage: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Refresh token is missing",
      });
    }

    // 재발급이 이미 진행 중입니다.
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }

    const debugName = `[#_callRefreshToken(${refreshToken.substring(0, 5)}...)] ==>`;
    this.debug(debugName, "begin");

    try {
      // 토큰 재발급은 비동기 작업입니다.
      //  Deferred 객체를 사용하면 이 비동기 작업을 보다 명확하게 제어할 수 있습니다.
      //  예를 들어, 토큰 재발급 요청이 완료되면 resolve를 호출하고, 오류가 발생하면 reject를 호출할 수 있습니다.
      this.refreshingDeferred = new Deferred<CallRefreshTokenResult>();

      // 세션 객체를 갱신합니다.
      const { session } = await this._refreshAccessToken(refreshToken, true);
      if (!session) {
        throw createHttpError({
          statusMessage: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Failed to refresh token",
        });
      }

      // 세션을 저장하고, 모든 구독자에게 "TOKEN_REFRESHED" 이벤트를 알립니다.
      await this._saveSession(session);
      await this._notifyAllSubscribers("TOKEN_REFRESHED", session);

      const result = { session, error: null };

      // 토큰 갱신 요청이 완료되었습니다.
      this.refreshingDeferred.resolve(result);

      return result;
    } catch (error) {
      this.error(debugName, error);
      if (isHttpError(error) || isFetchError(error)) {
        const result = { session: null, error };

        // 스토리지 세션을 삭제합니다.
        await this._removeSession();

        // 토큰 갱신 요청이 완료되었습니다.
        this.refreshingDeferred?.resolve(result);

        return result;
      }

      // 토큰 갱신 요청이 실패한 경우 reject를 호출합니다.
      this.refreshingDeferred?.reject(error);
      throw error;
    } finally {
      // 모든 작업이 완료되면, Deferred 객체를 초기화합니다.
      this.refreshingDeferred = null;
      this.debug(debugName, "end");
    }
  }

  /**
   * 토큰 재발급
   * @param {string} refreshToken - 갱신 토큰
   * @param {boolean?} throwOnError - 에러 발생 시 예외를 던질지 여부
   */
  private async _refreshAccessToken(
    refreshToken: string,
    throwOnError?: boolean,
  ) {
    try {
      // 토근 갱신 요청
      const data = await this.api
        .rpc("refresh")
        .patch()
        .setSafeBody({ refreshToken })
        .run();

      switch (data.resultCode) {
        case HttpResultStatus.OK: {
          // 세션 객체 생성하고 저장하지 않고 반환
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

      // HTTP 에러나 Fetch 에러가 발생했을 때
      if (
        isHttpError<ApiBuilderReturnValue<"refresh", "PATCH">>(error) ||
        isFetchError<ApiBuilderReturnValue<"refresh", "PATCH">>(error)
      ) {
        return {
          data: null,
          session: null,
          error,
        };
      }

      // 그 외의 에러가 발생했을 때
      return {
        data: null,
        session: null,
        error: createHttpError({
          statusMessage: "Internal Server Error",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to refresh token",
          data: error,
        }),
      };
    }
  }

  /**
   * 올바른 세션인지 체크라는 함수
   * @param {unknown} maybeSession - 세션 객체
   */
  private _isValidSession(maybeSession: unknown): maybeSession is Session {
    const isValidSession =
      typeof maybeSession === "object" &&
      maybeSession !== null &&
      "access_token" in maybeSession &&
      "refresh_token" in maybeSession &&
      "expires_at" in maybeSession;

    return isValidSession;
  }

  /**
   * 세션에 대한 변경이 발생할 때마다 호출되는 콜백 함수를 등록합니다.
   * @param {Function} callback - 세션 변경 콜백 함수
   */
  onAuthStateChange(
    callback: (
      event: AuthChangeEvent,
      session: Session | null,
    ) => void | Promise<void>,
  ) {
    const debugName = "[#onAuthStateChange()] ==>";
    this.debug(debugName, "begin");

    // 고유한 ID를 생성합니다.
    const id: string = uuid();
    // 콜백 함수를 Subscription 객체로 묶어서 저장합니다.
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

    // 세션 변경 콜백 함수를 저장합니다.
    this.stateChangeEmitters.set(id, subscription);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      // 세션 변경 콜백 함수를 등록하면서, 초기 세션을 발생시킵니다.
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

  /**
   * 세션을 로드하고 파라미터인 콜백 함수에 세션값을 전달
   * @param {Function} fn - 세션을 전달할 콜백 함수
   */
  private async _useSession<R>(
    fn: (result: LoadSession) => Promise<R>,
  ): Promise<R> {
    const debugName = "[#_useSession()] ==>";
    this.debug(debugName, "begin");

    try {
      // 세션을 로드합니다.
      const result = await this._loadSession();

      return await fn(result);
    } finally {
      this.debug(debugName, "end");
    }
  }

  /**
   * 세션을 로드합니다.
   */
  private async _loadSession(): Promise<LoadSession> {
    const debugName = "[#_loadSession()] ==>";
    this.debug(debugName, "begin");

    // 세션을 로드하기 전에 잠금을 획득합니다.
    if (!this.lockAcquired) {
      this.debug(
        debugName,
        "used outside of an acquired lock!",
        new Error().stack,
      );
    }

    try {
      let currentSession: Session | null = null;

      // 세션을 로드합니다.
      const maybeSession = await getItemAsync(this.storage, this.storageKey);

      if (maybeSession !== null) {
        // 세션이 유효한지 확인합니다.
        if (this._isValidSession(maybeSession)) {
          currentSession = maybeSession;
        } else {
          // 세션이 유효하지 않다면, 세션을 삭제합니다.
          await this._removeSession();
        }
      }

      // 세션을 반환합니다.
      if (!currentSession) {
        return { session: null, error: null };
      }

      // 세션이 만료되었는지 체크합니다.
      const hasExpired = currentSession.expires_at
        ? isBefore(currentSession.expires_at, new Date())
        : false;

      this.debug(
        debugName,
        `session has${hasExpired ? "" : " not"} expired`,
        "expires_at",
        currentSession.expires_at,
      );

      // 세션이 만료되지 않았다면, 세션을 반환합니다.
      if (!hasExpired) {
        return { session: currentSession, error: null };
      }

      // 세션이 만료되었다면, 토큰을 갱신합니다.
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

  private async _handleMessage(event: MessageEvent<HandleMessageData>) {
    this.debug(
      "received broadcast notification from other tab or client",
      event,
    );

    const eventName = event.data.event;
    const session = event.data.session;

    await this._notifyAllSubscribers(eventName, session, false); // broadcast = false so we don't get an endless loop of messages
  }

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
      if (this.initializePromise) {
        await this.initializePromise;
      }
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

  /**
   * 초기 세션을 발생시킵니다.
   * @param {string} id - 콜백 ID
   */
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
