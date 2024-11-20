import type { components, paths } from "@template/api-types";
import type { AuthError } from "@template/common";
import { createAuthError, HttpStatusCode, isAuthError } from "@template/common";
import {
  isBrowser,
  isNullOrUndefined,
  isPromiseLike,
  isTrusted,
} from "@template/utils/assertion";
import { addSeconds, isBefore, subMinutes, toDate } from "@template/utils/date";

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
import { localStorageAdapter } from "./adapters/local";
import { memoryLocalStorageAdapter } from "./adapters/memory";
import {
  AUTO_REFRESH_TICK_DURATION,
  AUTO_REFRESH_TICK_THRESHOLD,
  EXPIRY_MARGIN,
  STORAGE_KEY,
} from "./constants";
import { Deferred } from "./utils/deferred";
import {
  getItemAsync,
  isSupportedBroadcastChannel,
  isSupportedNavigatorLocks,
  isSupportedWindowAddEventListener,
  isSupportsLocalStorage,
  removeItemAsync,
  setItemAsync,
  uuid,
} from "./utils/helper";
import { LockAcquireTimeoutError, lockNoOp, navigatorLock } from "./utils/lock";
import { polyfillGlobalThis } from "./utils/polyfills";

// 전역 객체에 대한 폴리필을 적용합니다.
polyfillGlobalThis();

export class AuthClient {
  /**
   * @memberof AuthClient
   * @protected
   * @description 디버그 메시지를 출력할지 여부
   * @type {boolean} - logDebugMessages
   */
  protected logDebugMessages = false;
  /**
   * @memberof AuthClient
   * @protected
   * @description API 클라이언트
   * @type {AuthClientOptions["api"]} - api
   */
  protected api: AuthClientOptions["api"];

  /**
   * @memberof AuthClient
   * @protected
   * @description 클라이언트 | 서버 세션을 저장하는 키
   * @type {string} - storageKey
   */
  protected storageKey: string;

  /**
   * @memberof AuthClient
   * @protected
   * @description 토큰 자동 갱신 여부
   * @type {boolean} - autoRefreshToken
   */
  protected autoRefreshToken: boolean;
  /**
   * @memberof AuthClient
   * @protected
   * @description 메모리 스토리지가 아닌 스토리지에 세션을 저장할지 여부
   * @type {boolean} - persistSession
   */
  protected persistSession: boolean;
  /**
   * @memberof AuthClient
   * @protected
   * @description 스토리지 (local, memory)
   * @type {SupportedStorage} - storage
   */
  protected storage: SupportedStorage;
  /**
   * @memberof AuthClient
   * @protected
   * @description 메모리 스토리지
   * @type {Record<string, string> | null} - memoryStorage
   */
  protected memoryStorage: Record<string, string> | null = null;
  /**
   * @memberof AuthClient
   * @protected
   * @description 서버 사이드에서 세션에 접근 할 때 보안상 문제가 발생 할 수 있는 부분을 노출하기 위한 플래그
   * @type {boolean} - suppressGetSessionWarning
   */
  protected suppressGetSessionWarning = false;

  /**
   * @memberof AuthClient
   * @protected
   * @description 클라이언트 세션 상태 변경 이벤트를 구독하는 콜백 함수
   * @type {Map<string, Subscription>} - stateChangeEmitters
   */
  protected stateChangeEmitters: Map<string, Subscription> = new Map<
    string,
    Subscription
  >();
  /**
   * @memberof AuthClient
   * @protected
   * @description 자동 갱신 티커 함수를 저장하는 변수
   * @type {ReturnType<typeof setInterval> | null} - autoRefreshTicker
   */
  protected autoRefreshTicker: ReturnType<typeof setInterval> | null = null;
  /**
   * @memberof AuthClient
   * @protected
   * @description 가시성 변경 콜백 함수
   * @type {(() => Promise<unknown>) | null} - visibilityChangedCallback
   */
  protected visibilityChangedCallback: (() => Promise<unknown>) | null = null;
  /**
   * @memberof AuthClient
   * @protected
   * @description 토큰 갱신 요청에 대한 Deferred 객체
   * @type {Deferred<CallRefreshTokenResult> | null} - refreshingDeferred
   */
  protected refreshingDeferred: Deferred<CallRefreshTokenResult> | null = null;
  /**
   * @memberof AuthClient
   * @protected
   * @description 클라이언트 세션 초기화 프로미스
   * @type {Promise<InitializeResult> | null} - initializePromise
   */
  protected initializePromise: Promise<InitializeResult> | null = null;

  /**
   * @memberof AuthClient
   * @protected
   * @description 클라이언트 세션을 잠그기 위한 함수
   * @type {LockFunc} - lock
   */
  protected lock: LockFunc;
  /**
   * @memberof AuthClient
   * @protected
   * @description 잠금 획득 여부
   * @type {boolean} - lockAcquired
   */
  protected lockAcquired = false;
  /**
   * @memberof AuthClient
   * @protected
   * @description 잠금 대기열
   * @type {Promise<any>[]} - pendingInLock
   */
  protected pendingInLock: Promise<any>[] = [];

  /**
   * @memberof AuthClient
   * @protected
   * @description 멀티 탭 상태 변경을 위한 브로드캐스트 채널
   * @type {BroadcastChannel | null} - broadcastChannel
   */
  protected broadcastChannel: BroadcastChannel | null = null;

  constructor(options: AuthClientOptions) {
    this.logDebugMessages = options.logDebugMessages ?? false;
    this.api = options.api;
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

        this._handleMessage.bind(this),
      );
    }

    this.initialize();
  }

  /**
   * @memberof AuthClient
   * @description 클라이언트 세션을 초기화합니다. 이 메서드는 세션을 복구하고 갱신하는 역할을 합니다.
   * @returns {Promise<InitializeResult>}
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
   * @memberof AuthClient
   * @private
   * @description 클라이언트 세션 초기화
   * 1. 메서드는 생성자에서 호출되므로 예외를 던지지 않도록 주의
   * 2. 캐시에 저장되므로 이 메서드에서 세션을 반환하지 않아야 함
   * @returns {Promise<InitializeResult>}
   */
  private async _initialize(): Promise<InitializeResult> {
    const debugName = "[#_initialize()] ==>";
    this.debug(debugName, "start");
    try {
      await this._recoverAndRefresh();
      return { error: undefined };
    } catch (error) {
      if (isAuthError(error)) {
        return { error };
      }

      return {
        error: createAuthError({
          code: "unknown_error",
          message: "Unexpected error during initialization",
        }),
      };
    } finally {
      await this._handleVisibilityChange();
      this.debug(debugName, "end");
    }
  }

  /**
   * @memberof AuthClient
   * @description 클라이언트 저장소에 저장된 세션 정보
   * @returns {Promise<LoadSession>}
   */
  async getSession(): Promise<LoadSession> {
    if (this.initializePromise) {
      await this.initializePromise;
    }

    const result = await this._acquireLock(-1, () => {
      return this._useSession(async (result) => result);
    });

    return result;
  }

  /**
   * @memberof AuthClient
   * @description 회원가입
   * @param {paths["/api/v1/auth/signup"]["post"]["requestBody"]["content"]["application/json"]} body - 회원가입 정보
   */
  async signUp(
    body: paths["/api/v1/auth/signUp"]["post"]["requestBody"]["content"]["application/json"],
  ): Promise<{
    data:
      | paths["/api/v1/auth/signUp"]["post"]["responses"]["200"]["content"]["application/json"]
      | undefined;
    session: Session | undefined;
    error:
      | paths["/api/v1/auth/signUp"]["post"]["responses"]["400"]["content"]["application/json"]
      | undefined;
  }> {
    const { data, error } = await this.api
      .method("post")
      .path("/api/v1/auth/signUp")
      .setBody(body)
      .run();

    if (data?.data) {
      const session = this._makeSession(data.data);
      await this._saveSession(session);
      await this._notifyAllSubscribers("SIGNED_IN", session);
      return { data, session, error };
    }

    return { data, session: undefined, error };
  }

  /**
   * @memberof AuthClient
   * @description 로그인
   * @param {paths["/api/v1/auth/signin"]["post"]["requestBody"]["content"]["application/json"]} body - 로그인 정보
   */
  async signIn(
    body: paths["/api/v1/auth/signIn"]["post"]["requestBody"]["content"]["application/json"],
  ): Promise<{
    data:
      | paths["/api/v1/auth/signIn"]["post"]["responses"]["200"]["content"]["application/json"]
      | undefined;
    session: Session | undefined;
    error:
      | paths["/api/v1/auth/signIn"]["post"]["responses"]["400"]["content"]["application/json"]
      | paths["/api/v1/auth/signIn"]["post"]["responses"]["401"]["content"]["application/json"]
      | paths["/api/v1/auth/signIn"]["post"]["responses"]["404"]["content"]["application/json"]
      | undefined;
  }> {
    const { data, error } = await this.api
      .method("post")
      .path("/api/v1/auth/signIn")
      .setBody(body)
      .run();

    if (data?.data) {
      // 세션 객체 생성
      const session = this._makeSession(data.data);
      // 세션 객체 스토리지에 저장
      await this._saveSession(session);
      // 로그인에 대한 이벤트 등록
      await this._notifyAllSubscribers("SIGNED_IN", session);
      return { data, session, error: undefined };
    }

    return { data, session: undefined, error };
  }

  /**
   * @memberof AuthClient
   * @description 토큰을 이용해서 유저 정보 가져오기
   * @param {string?} jwt - JWT 토큰
   * @returns {Promise<GetUserResponse>}
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
   * @memberof AuthClient
   * @description 로그아웃
   */
  async signOut(): Promise<{
    error:
      | paths["/api/v1/auth/signout"]["post"]["responses"]["400"]["content"]["application/json"]
      | paths["/api/v1/auth/signout"]["post"]["responses"]["401"]["content"]["application/json"]
      | paths["/api/v1/auth/signout"]["post"]["responses"]["404"]["content"]["application/json"]
      | AuthError
      | undefined;
  }> {
    if (this.initializePromise) {
      await this.initializePromise;
    }

    return await this._acquireLock(-1, async () => {
      return await this._signOut();
    });
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 토큰을 통해서 유저 정보 가져오기
   * @param {string?} jwt - JWT 토큰
   * @returns {Promise<GetUserResponse>}
   */
  private async _getUser(jwt?: string): Promise<GetUserResponse> {
    try {
      // 토큰이 존재한다면, 토큰을 이용해서 유저 정보를 가져옵니다.
      if (jwt) {
        const { data, error } = await this.api
          .method("get")
          .path("/api/v1/users/me")
          .setAuthorization(jwt)
          .run();

        return {
          user: data?.data,
          error,
        };
      }

      // 유저 정보를 가져오기 위해 세션을 이용합니다.
      return await this._useSession(async (result) => {
        if (result.error) {
          throw result.error;
        }

        // 세션이 없다면, 에러를 발생시킵니다.
        if (!result.session?.access_token) {
          return {
            user: undefined,
            error: createAuthError({
              message: "AuthSessionMissingError",
              statusCode: HttpStatusCode.BAD_REQUEST,
              code: "invalid_token",
            }),
          };
        }

        // 유저 정보를 가져옵니다.
        const { data, error } = await this.api
          .method("get")
          .path("/api/v1/users/me")
          .setAuthorization(result.session.access_token)
          .run();

        return {
          user: data?.data,
          error,
        };
      });
    } catch (error) {
      if (isAuthError(error)) {
        const data = error.toJSON();
        if (data.message === "AuthSessionMissingError") {
          await this._removeSession();
          await this._notifyAllSubscribers("SIGNED_OUT", undefined);
        }
        return { user: undefined, error };
      }

      throw error;
    }
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 인증 응답값을 세션값으로 변경
   * @param {components["schemas"]["AuthResponseDto"]} data - 인증 응답값
   * @returns {Session}
   */
  private _makeSession(
    data: components["schemas"]["AuthTokenResponseDto"],
  ): Session {
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
   * @memberof AuthClient
   * @private
   * @description 스토리지 저장
   * @param {Session} session - 세션 객체
   * @returns {Promise<void>}
   */
  private async _saveSession(session: Session): Promise<void> {
    this.debug("[#_saveSession()] ==>", session);
    await setItemAsync(this.storage, this.storageKey, session);
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 스트리지 삭제
   * @returns {Promise<void>}
   */
  private async _removeSession(): Promise<void> {
    this.debug("[#_removeSession()]");
    await removeItemAsync(this.storage, this.storageKey);
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 잠금을 획득된 상태에서 추가적인 비동기 작업을 수행하기 위해 사용
   * @param {Function} fn - 비동기 작업 함수
   * @returns {Promise<R>}
   */
  private async _waitForLockRelease<R>(fn: () => Promise<R>): Promise<R> {
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
   * @memberof AuthClient
   * @private
   * @description 스토리지 키를 이용해서 전역 잠금을 건다.
   * @param {number} acquireTimeout - 잠금 획득 시간
   * @param {Function} fn - 잠금 획득 후 실행할 함수
   * @returns {Promise<R>}
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
        this.logDebugMessages,
      );
    } finally {
      this.debug(debugName, "end");
    }
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 로그아웃
   */
  private async _signOut(): Promise<{
    error:
      | paths["/api/v1/auth/signout"]["post"]["responses"]["400"]["content"]["application/json"]
      | paths["/api/v1/auth/signout"]["post"]["responses"]["401"]["content"]["application/json"]
      | paths["/api/v1/auth/signout"]["post"]["responses"]["404"]["content"]["application/json"]
      | AuthError
      | undefined;
  }> {
    return await this._useSession(async (result) => {
      const { session, error: sessionError } = result;
      if (sessionError) {
        return { error: sessionError };
      }

      const accessToken = session?.access_token;
      let error:
        | paths["/api/v1/auth/signout"]["post"]["responses"]["400"]["content"]["application/json"]
        | paths["/api/v1/auth/signout"]["post"]["responses"]["401"]["content"]["application/json"]
        | paths["/api/v1/auth/signout"]["post"]["responses"]["404"]["content"]["application/json"]
        | undefined;
      // 토큰이 있다면 로그아웃 요청
      if (accessToken) {
        const result = await this.api
          .method("post")
          .path("/api/v1/auth/signout")
          .setBody({
            accessToken,
          })
          .run();

        if (result.error) {
          error = result.error;
        }
      }

      // 실패해도 세션 삭제
      await this._removeSession();
      // 로그아웃에 대한 이벤트 등록
      await this._notifyAllSubscribers("SIGNED_OUT", undefined);

      return { error };
    });
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 세션을 복구하고 갱신합니다.
   * @returns {Promise<void>}
   */
  private async _recoverAndRefresh(): Promise<void> {
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
   * @memberof AuthClient
   * @private
   * @description 토큰 갱신 요청
   * @param {string?} refreshToken - 갱신 토큰
   * @returns {Promise<CallRefreshTokenResult>}
   */
  private async _callRefreshToken(
    refreshToken?: string,
  ): Promise<CallRefreshTokenResult> {
    // 갱신 토큰이 없다면, 에러를 발생시킵니다.
    if (!refreshToken) {
      throw createAuthError({
        message: "AuthSessionMissingError",
        statusCode: HttpStatusCode.BAD_REQUEST,
        code: "invalid_token",
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
      const { session } = await this._refreshAccessToken(refreshToken);
      if (!session) {
        throw createAuthError({
          message: "AuthSessionMissingError",
          statusCode: HttpStatusCode.BAD_REQUEST,
          code: "session_not_found",
        });
      }

      // 세션을 저장하고, 모든 구독자에게 "TOKEN_REFRESHED" 이벤트를 알립니다.
      await this._saveSession(session);
      await this._notifyAllSubscribers("TOKEN_REFRESHED", session);

      const result = { session, error: undefined };

      // 토큰 갱신 요청이 완료되었습니다.
      this.refreshingDeferred.resolve(result);

      return result;
    } catch (error) {
      this.error(debugName, error);
      if (isAuthError(error)) {
        const result = { session: undefined, error };

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
   * @memberof AuthClient
   * @private
   * @description 토큰 재발급
   * @param {string} refreshToken - 갱신 토큰
   */
  private async _refreshAccessToken(refreshToken: string): Promise<{
    data: components["schemas"]["AuthTokenResponseDto"] | undefined;
    session: Session | undefined;
    error:
      | paths["/api/v1/auth/token"]["post"]["responses"]["400"]["content"]["application/json"]
      | paths["/api/v1/auth/token"]["post"]["responses"]["401"]["content"]["application/json"]
      | paths["/api/v1/auth/token"]["post"]["responses"]["404"]["content"]["application/json"]
      | undefined;
  }> {
    // 토근 갱신 요청
    const { data, error } = await this.api
      .method("post")
      .path("/api/v1/auth/token")
      .setBody({
        refreshToken,
      })
      .setParams({
        query: {
          grantType: "refresh_token",
        },
      })
      .run();

    if (data?.data) {
      const session = this._makeSession(data.data);
      return { data: data.data, session, error: undefined };
    }

    return {
      data: data?.data,
      session: undefined,
      error,
    };
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 올바른 세션인지 체크라는 함수
   * @param {unknown} maybeSession - 세션 객체
   * @returns {maybeSession is Session}
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
   * @memberof AuthClient
   * @private
   * @description 세션에 대한 변경이 발생할 때마다 호출되는 콜백 함수를 등록합니다.
   * @param {Function} callback - 세션 변경 콜백 함수
   * @returns {{ data: { subscription: Subscription; }}}
   */
  onAuthStateChange(
    callback: (
      event: AuthChangeEvent,
      session: Session | undefined,
    ) => void | Promise<void>,
  ): { data: { subscription: Subscription } } {
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

    (async () => {
      // 세션 변경 콜백 함수를 등록하면서, 초기 세션을 발생시킵니다.
      if (this.initializePromise) {
        await this.initializePromise;
      }

      await this._acquireLock(-1, async () => {
        this._emitInitialSession(id);
      });
    })();

    return { data: { subscription } };
  }

  /**
   * @memberof AuthClient
   * @private
   * @description "authStateChange" 이벤트가 발생하면 해당 이벤트를 구독자에게 알립니다.
   * @param {AuthChangeEvent} event
   * @param {Session | undefined} session
   * @param {boolean | undefined} broadcast
   * @returns {Promise<void>}
   */
  private async _notifyAllSubscribers(
    event: AuthChangeEvent,
    session: Session | undefined,
    broadcast: boolean | undefined = true,
  ): Promise<void> {
    const debugName = `[#_notifyAllSubscribers(${event})] ==>`;
    this.debug(debugName, "begin", session, `broadcast = ${broadcast}`);

    try {
      // 브로드캐스트 채널이 존재하고, 브로드캐스트가 활성화되어 있다면, 이벤트를 발생시킵니다.
      if (this.broadcastChannel && broadcast) {
        this.broadcastChannel.postMessage({ event, session });
      }

      const errors: unknown[] = [];

      // stateChangeEmitters에 등록된 Map의 값을 가져옵니다.
      const emitters = Array.from(this.stateChangeEmitters.values());

      // 값들을 순서대로 순회하면서 이벤트를 발생시킵니다. 그리고 에러가 발생하면 에러를 저장합니다.
      const promises = emitters.map(async (x) => {
        try {
          if (isPromiseLike<void>(x.callback)) {
            await x.callback(event, session);
          } else {
            void x.callback(event, session);
          }
        } catch (e) {
          errors.push(e);
        }
      });

      await Promise.all(promises);

      // 에러가 존재하면 해당 에러에 대해서 로그를 출력하고, 가장 첫번째 에러를 발생시킵니다.
      if (errors.length > 0) {
        for (const error of errors) {
          this.error(error);
        }

        const firstError = errors.at(0);
        if (firstError) {
          throw firstError as Error;
        }
      }
    } finally {
      this.debug(debugName, "end");
    }
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 세션을 로드하고 파라미터인 콜백 함수에 세션값을 전달
   * @param {Function} fn - 세션을 전달할 콜백 함수
   * @returns {Promise<R>}
   */
  private async _useSession<R>(
    fn: (result: LoadSession) => Promise<R>,
  ): Promise<R> {
    const debugName = "[#_useSession()] ==>";
    this.debug(debugName, "begin");

    try {
      // 세션을 로드합니다.
      const result = await this._loadSession();

      // 세션을 콜백 함수에 전달합니다.
      return await fn(result);
    } finally {
      this.debug(debugName, "end");
    }
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 세션을 로드합니다.
   * @returns {Promise<LoadSession>}
   */
  private async _loadSession(): Promise<LoadSession> {
    const debugName = "[#_loadSession()] ==>";
    this.debug(debugName, "begin");

    // 현재 획득한 잠김이 다른곳에서 사용중인 경우.
    if (!this.lockAcquired) {
      this.debug(
        debugName,
        "used outside of an acquired lock!",
        new Error().stack,
      );
    }

    try {
      let currentSession: Session | undefined = undefined;

      // 세션을 로드합니다.
      const maybeSession = await getItemAsync(this.storage, this.storageKey);

      if (!isNullOrUndefined(maybeSession)) {
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
        return { session: undefined, error: undefined };
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
        if (this.storage.isServer) {
          let suppressWarning = this.suppressGetSessionWarning;
          // 접근 모니터링: 프록시를 통해 'user' 속성에 접근할 때마다 경고 메시지가 표시한다. 이는 개발자에게 잠재적인 보안 위험을 알리고, 더 안전한 방법을 사용하도록 유도합니다.
          // 직접 접근 제한: 프록시는 세션 객체의 'user' 속성에 대한 직접적인 접근을 차단하고 이를 통해 의도치 않은 데이터 노출을 방지
          // 세션 하이재킹 방지: 프록시를 통한 간접 접근은 세션 데이터의 무단 수정이나 악용을 어렵게 만들어 세션 하이재킹과 같은 공격을 방지하는 데 도움됨.
          const proxySession: Session = new Proxy(currentSession, {
            get: (target, prop: string, receiver) => {
              if (!suppressWarning && prop === "user") {
                // 서버에서 사용자 객체에 액세스하는 경우에만 경고를 표시합니다.
                this.warn(
                  'Warning: Direct access to the "user" property of the session object is not allowed. Use the "getSession()" method to access the user object.',
                );
                suppressWarning = true; // 이 프록시 인스턴스가 추가 경고를 기록하지 않게함
                this.suppressGetSessionWarning = true; // 이 클라이언트의 향후 프록시 인스턴스가 경고되지 않게함
              }
              return Reflect.get(target, prop, receiver) as unknown as Session;
            },
          });
          currentSession = proxySession;
        }

        return { session: currentSession, error: undefined };
      }

      // 세션이 만료되었다면, 토큰을 갱신합니다.
      const { session, error } = await this._callRefreshToken(
        currentSession.refresh_token,
      );

      if (error) {
        return { session: undefined, error };
      }

      return { session, error: undefined };
    } finally {
      this.debug(debugName, "end");
    }
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 화면 보이거나 숨겨질 때 발생하는 이벤트를 처리합니다.
   * @returns {Promise<boolean | void>}
   */
  private async _handleVisibilityChange(): Promise<boolean | void> {
    if (!isBrowser() || !isSupportedWindowAddEventListener()) {
      if (this.autoRefreshToken) {
        this.startAutoRefresh();
      }

      return false;
    }

    try {
      // 브라우저 환경에서 가시성 변경 이벤트를 처리합니다.
      this.visibilityChangedCallback = async () =>
        await this._onVisibilityChanged(false);

      // 이벤트 리스너를 등록합니다.
      window.addEventListener(
        "visibilitychange",
        this.visibilityChangedCallback,
      );

      // 가시성 변경 이벤트를 등록 했다면 등록한 순간부터 가시성을 체크합니다.
      await this._onVisibilityChanged(true);
    } catch (error) {
      this.error("_handleVisibilityChange", error);
    }
  }

  /**
   * @memberof AuthClient
   * @private
   * @param {boolean} calledFromInitialize - 초기화 함수에서 호출되었는지 여부
   * @returns {Promise<void>}
   */
  private async _onVisibilityChanged(
    calledFromInitialize: boolean,
  ): Promise<void> {
    const methodName = `[#_onVisibilityChanged(${calledFromInitialize})] ==>`;
    this.debug(methodName, "visibilityState", document.visibilityState);

    // 화면이 보이는 상태라면
    if (document.visibilityState === "visible") {
      // 자동 재발급 토큰이 활성화되어 있다면, 자동 갱신을 시작합니다.
      if (this.autoRefreshToken) {
        // 브라우저 환경에서 새로 고침 토큰 티커는 초점이 맞춰진 탭에서만 실행.
        // 이는 경쟁 조건을 방지.
        this._startAutoRefresh();
      }

      // 초기화 함수에서 호출되지 않았다면, 세션을 복구하고 갱신합니다.
      if (!calledFromInitialize) {
        // 가시성이 변경되었을 때 호출됨, 즉 브라우저
        // 숨김에서 표시로 전환되었으므로 세션을
        // 즉시 복구해야 하는지 확인 필요
        if (this.initializePromise) {
          await this.initializePromise;
        }

        // 세션을 복구하기 위해서는 먼저 비동기적으로 잠금을 획득 필요
        await this._acquireLock(-1, async () => {
          if (document.visibilityState !== "visible") {
            this.debug(
              methodName,
              "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting",
            );

            // 잠금을 기다리는 동안 가시성이 변경되어 중단
            return;
          }

          await this._recoverAndRefresh();
        });
      }
    } else {
      // 화면이 보이지 않는 상태라면, 자동 갱신을 중지합니다.
      if (this.autoRefreshToken) {
        this._stopAutoRefresh();
      }
    }
  }

  /**
   * @Mebmerof AuthClient
   * @private
   * @description 브라우저 간 메시지를 처리합니다.
   * @param {MessageEvent<HandleMessageData>} event - 메시지 이벤트
   * @returns {Promise<void>}
   */
  private async _handleMessage(
    event: MessageEvent<HandleMessageData>,
  ): Promise<void> {
    this.debug(
      "received broadcast notification from other tab or client",
      event,
    );

    const eventName = event.data.event;
    const session = event.data.session;

    // broadcast = false이므로 메시지의 무한 루프가 발생하지 않습니다.
    await this._notifyAllSubscribers(eventName, session, false);
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 자동 갱신 틱 함수를 시작합니다
   * @returns {Promise<void>}
   */
  private async _startAutoRefresh(): Promise<void> {
    // 이미 실행중인 자동 갱신 틱 함수가 있다면 중지합니다.
    await this._stopAutoRefresh();

    // 새로운 자동 갱신 틱 함수를 시작합니다.
    const ticker = setInterval(
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

    // 비동기 작업을 다음 이벤트 루프 사이클로 미루기.
    // 이를 통해 현재 실행 중인 작업이 완료된 후에 비동기 작업을 실행할 수 있으며,
    // 초기화가 완료된 후에 작업을 실행하거나 콜 스택이 비워진 후에 작업을 실행할 수 있습니다
    setTimeout(async () => {
      if (this.initializePromise) {
        await this.initializePromise;
      }
      await this._autoRefreshTokenTick();
    }, 0);
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 자동 갱신 틱 함수를 중지합니다
   * @returns {Promise<void>}
   */
  private async _stopAutoRefresh(): Promise<void> {
    const ticker = this.autoRefreshTicker;
    this.autoRefreshTicker = null;

    if (ticker) {
      clearInterval(ticker);
    }
  }

  /**
   * @memberof AuthClient
   * @description 자동 갱신을 시작합니다.
   * @returns {Promise<void>}
   */
  async startAutoRefresh(): Promise<void> {
    this._removeVisibilityChangedCallback();
    await this._startAutoRefresh();
  }

  /**
   * @memberof AuthClient
   * @description 자동 갱신을 중지합니다.
   * @returns {Promise<void>}
   */
  async stopAutoRefresh(): Promise<void> {
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
  }

  /**
   * @memberof AuthClient
   * @private
   * @description visibilitychange 콜백을 제거합니다.
   * @returns {void}
   */
  private _removeVisibilityChangedCallback(): void {
    const callback = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (callback && isBrowser() && window.removeEventListener) {
        window.removeEventListener("visibilitychange", callback);
      }
    } catch (e) {
      this.error("removing visibilitychange callback failed", e);
    }
  }

  /**
   * @memberof AuthClient
   * @private
   * @description 토큰 갱신을 위한 자동 갱신 틱 함수
   * @returns {Promise<void>}
   */
  private async _autoRefreshTokenTick(): Promise<void> {
    const debugName = "[#_autoRefreshTokenTick()] ==>";
    try {
      await this._acquireLock(0, async () => {
        try {
          const timeNow = Date.now();

          try {
            return await this._useSession(async (result) => {
              const { session } = result;

              if (!session?.refresh_token || !session.expires_at) {
                this.debug(debugName, "no session");
                return;
              }

              const expiresAt = session.expires_at ?? 0;
              const expiresIn = expiresAt - timeNow;

              // 세션은 이 tick 수 후에 만료됩니다(<= 0이면 이미 만료됨)
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
   * @memberof AuthClient
   * @private
   * @description 초기 세션을 발생시킵니다.
   * @param {string} id - 콜백 ID
   * @returns {Promise<void>}
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
          ?.callback("INITIAL_SESSION", undefined);
        this.debug("INITIAL_SESSION", "callback id", id, "error", err);
        this.error(err);
      }
    });
  }

  protected debug(...args: unknown[]) {
    if (this.logDebugMessages) {
      console.debug(
        `[Debug message][${isBrowser() ? "client" : "server"}] `,
        ...args,
      );
    }
    return this;
  }

  protected error(...args: unknown[]) {
    console.error(
      `[Error message][${isBrowser() ? "client" : "server"}] `,
      ...args,
    );
    return this;
  }

  protected warn(...args: unknown[]) {
    console.warn(
      `[Warning message][${isBrowser() ? "client" : "server"}] `,
      ...args,
    );
    return this;
  }
}
