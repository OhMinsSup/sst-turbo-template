import type { ApiClient, TokenResponse, UserResponse } from "@template/sdk";
import {
  clearCookie,
  getTokenFromCookie,
  setTokenCookie,
} from "@template/utils/cookie";
import { isAccessTokenExpireDate } from "@template/utils/date";
import { jwtDecode } from "@template/utils/jwt";

import type {
  AuthKitConstructorOptions,
  AuthKitParams,
  AuthKitReturnValue,
  AuthKitTokenKey,
  AuthKitValidateAuthParams,
} from "./types";
import {
  combineHeaders,
  mergeClearAuthTokens,
  mergeHeaders,
  mergeTokenHeaders,
} from "./_internal/misc";
import { AuthKitFramework, AuthKitStatus } from "./types";

export class AuthKit {
  private _client: ApiClient;

  private _tokenKey: AuthKitTokenKey;

  private _headers: Headers;

  private _tokens: TokenResponse | null = null;

  private _user: UserResponse | null = null;

  private _status: AuthKitStatus = AuthKitStatus.NotLogin;

  constructor(opts: AuthKitConstructorOptions) {
    this._client = opts.client;
    this._tokenKey = opts.tokenKey;
    this._headers = new Headers();
    if (opts.headers) {
      this.combineHeader(opts.headers);
    }
  }

  get headers() {
    return this._headers;
  }

  get tokens() {
    return this._tokens;
  }

  get user() {
    return this._user;
  }

  get status() {
    return this._status;
  }

  get client() {
    return this._client;
  }

  getJson<S extends AuthKitStatus = AuthKitStatus.NotLogin>(
    status: S,
  ): AuthKitReturnValue<S> {
    this._status = status;

    switch (status) {
      case AuthKitStatus.NotLogin:
      case AuthKitStatus.Error:
      case AuthKitStatus.Invalid: {
        this.setTokens(null);
        this.setUser(null);
        this.clearAuthTokens();
        return {
          status,
          user: this._user,
          tokens: this._tokens,
          headers: this._headers,
        } as AuthKitReturnValue<S>;
      }
      case AuthKitStatus.Refreshed:
      case AuthKitStatus.LoggedIn: {
        if (this._tokens) {
          this.setAuthTokens(this._tokens);
        }
        return {
          status,
          user: this._user,
          tokens: this._tokens,
          headers: this._headers,
        } as AuthKitReturnValue<S>;
      }
      default: {
        throw new Error("Invalid status");
      }
    }
  }

  /**
   * api client 설정
   */
  setApiClient(client: ApiClient) {
    this._client = client;
    return this;
  }

  /**
   * 쿠키에서 가져오거나 설정 할 토큰 키 이름 설정
   */
  setTokenKey(tokenKey: AuthKitTokenKey) {
    this._tokenKey = tokenKey;
    return this;
  }

  /**
   * 재발급, 발급 토근 설정
   */
  setTokens(tokens: TokenResponse | null) {
    this._tokens = tokens;
    return this;
  }

  /**
   * 유저 정보 설정
   */
  setUser(user: UserResponse | null) {
    this._user = user;
    return this;
  }

  /**
   * 헤더를 설정한다.
   */
  mergeHeader(...headers: (ResponseInit["headers"] | null | undefined)[]) {
    this._headers = mergeHeaders(this._headers, ...headers);
    return this;
  }

  /**
   * 헤더를 합친다.
   */
  combineHeader(...headers: (ResponseInit["headers"] | null | undefined)[]) {
    this._headers = combineHeaders(this._headers, ...headers);
    return this;
  }

  /**
   *  인증 관련 쿠키 값을 제거한다.
   */
  clearAuthTokens() {
    const headers = new Headers();
    for (const key of Object.values(this._tokenKey)) {
      headers.append("Set-Cookie", clearCookie(key as string));
    }
    this.combineHeader(headers);
    return this;
  }

  /**
   *  인증 관련 쿠키 값을 설정한다.
   */
  setAuthTokens(tokens: TokenResponse) {
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      setTokenCookie(this._tokenKey.accessTokenKey, tokens.accessToken),
    );
    headers.append(
      "Set-Cookie",
      setTokenCookie(this._tokenKey.refreshTokenKey, tokens.refreshToken),
    );
    this.combineHeader(headers);
    return this;
  }

  signin(token: TokenResponse) {
    return mergeTokenHeaders(this._tokenKey, token, this._headers);
  }

  signout() {
    return mergeClearAuthTokens(this._tokenKey, this._headers);
  }

  getTokens<F extends AuthKitFramework = AuthKitFramework.None>(
    cookie: F extends AuthKitFramework.SvelteKit
      ? { name: string; value: string }[]
      : string,
    framework: F,
  ) {
    switch (framework) {
      case AuthKitFramework.SvelteKit: {
        const cookies = cookie as unknown as { name: string; value: string }[];
        return cookies.reduce(
          (acc, { name, value }) => {
            if (name === this._tokenKey.accessTokenKey) {
              acc.accessToken = value;
            }
            if (name === this._tokenKey.refreshTokenKey) {
              acc.refreshToken = value;
            }
            return acc;
          },
          {
            accessToken: null,
            refreshToken: null,
          } as { accessToken: string | null; refreshToken: string | null },
        );
      }
      case AuthKitFramework.Next:
      case AuthKitFramework.None:
      case AuthKitFramework.Remix: {
        return getTokenFromCookie(cookie as unknown as string, this._tokenKey);
      }
      default: {
        throw new Error("Invalid framework");
      }
    }
  }

  /**
   * 토큰이 유효한지 체크
   */
  async verify(accessToken: string) {
    try {
      // 토큰이 유효한지 체크
      const response = await this._client.rpc("verify").post({
        token: accessToken,
      });

      return response.result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * 유저 정보를 가져온다.
   */
  async getUserInfo(accessToken: string) {
    try {
      const response = await this._client
        .rpc("me")
        .setAuthToken(accessToken)
        .get();
      return response.result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async checkAuth(tokens: AuthKitParams | null) {
    if (!tokens) {
      return this.getJson(AuthKitStatus.NotLogin);
    }

    return await this.auth(tokens);
  }

  /**
   * 인증 체크
   */
  async auth({ accessToken, refreshToken }: AuthKitParams) {
    if (!accessToken) {
      if (refreshToken) {
        return await this.refresh({ refreshToken });
      }
      return this.getJson(AuthKitStatus.NotLogin);
    }

    try {
      const ok = await this.verify(accessToken);
      // 토큰이 존재하는 해당 토큰이 잘못된 토큰인지 체크한다.
      if (!ok) {
        return this.getJson(AuthKitStatus.Invalid);
      }

      // accessToken이 만료되기 5분 전에 refreshToken으로 accessToken을 갱신한다.
      return await this.validateAuth({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      return this.getJson(AuthKitStatus.Error);
    }
  }

  async checkRefresh(tokens: AuthKitParams | null) {
    if (!tokens) {
      return this.getJson(AuthKitStatus.NotLogin);
    }

    return await this.refresh(tokens);
  }

  /**
   * 토큰 갱신
   */
  async refresh({ refreshToken }: Pick<AuthKitParams, "refreshToken">) {
    if (!refreshToken) {
      return this.getJson(AuthKitStatus.NotLogin);
    }

    const decode = jwtDecode(refreshToken);
    if (!decode) {
      return this.getJson(AuthKitStatus.Invalid);
    }

    try {
      const response = await this._client.rpc("refresh").patch({
        refreshToken,
      });

      const {
        result: { tokens },
      } = response;

      this.setTokens(tokens);
    } catch (error) {
      console.error(error);
      return this.getJson(AuthKitStatus.Error);
    }

    if (!this.tokens) {
      return this.getJson(AuthKitStatus.Error);
    }

    try {
      const user = await this.getUserInfo(this.tokens.accessToken.token);

      if (!user) {
        return this.getJson(AuthKitStatus.NotLogin);
      }

      this.setUser(user);
      return this.getJson(AuthKitStatus.Refreshed);
    } catch (error) {
      console.error(error);
      return this.getJson(AuthKitStatus.Error);
    }
  }

  /**
   * 인증 검증
   */
  async validateAuth({ accessToken, refreshToken }: AuthKitValidateAuthParams) {
    if (!refreshToken) {
      return this.getJson(AuthKitStatus.Invalid);
    }

    const refreshDecode = jwtDecode(refreshToken);
    if (!refreshDecode) {
      return this.getJson(AuthKitStatus.Invalid);
    }

    // accessToken의 decode해서 만료일자를 가져온다.
    const accessDecode = jwtDecode(accessToken);
    if (!accessDecode) {
      return this.getJson(AuthKitStatus.Invalid);
    }

    // access token이 만료되기 5분 전에 refresh token을 사용하여 access token을 갱신한다.
    if (accessDecode.exp && isAccessTokenExpireDate(accessDecode.exp * 1000)) {
      return await this.refresh({ refreshToken });
    }

    try {
      const tokens: TokenResponse = {
        accessToken: {
          token: accessToken,
          expiresAt: (accessDecode.exp as unknown as number) * 1000,
        },
        refreshToken: {
          token: refreshToken,
          expiresAt: (refreshDecode.exp as unknown as number) * 1000,
        },
      };

      this.setTokens(tokens);

      const user = await this.getUserInfo(accessToken);

      if (!user) {
        return this.getJson(AuthKitStatus.NotLogin);
      }

      this.setUser(user);
      // refresh를 할 필요가 없는 경우
      return this.getJson(AuthKitStatus.LoggedIn);
    } catch (error) {
      console.error(error);
      return this.getJson(AuthKitStatus.Error);
    }
  }
}
