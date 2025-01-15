import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { container, injectable, singleton } from "tsyringe";

import type { AuthClient, Session, User } from "@template/auth";

import { auth } from "~/.server/utils/auth";
import { PAGE_ENDPOINTS } from "~/constants/constants";

type RemixRunArgs = LoaderFunctionArgs | ActionFunctionArgs;

interface RequireAuthParams {
  redirectTo?: string | null;
  client: AuthClient;
  request: Request;
}

export interface Auth {
  session: Session | undefined;
  user: User | undefined;
}

@singleton()
@injectable()
export class AuthMiddleware {
  /**
   * @description 인증 체크 미들웨어
   * @param {RemixRunArgs} args
   * @param {Function} next
   * @param {string | null} redirectTo
   */
  async authenticate<TData>(
    args: RemixRunArgs,
    next:
      | ((client: AuthClient, headers: Request["headers"]) => Promise<TData>)
      | ((client: AuthClient, headers: Request["headers"]) => TData),
    redirectTo?: string | null,
  ) {
    const { authClient, headers } = auth.handler(args);

    await this.requireUser({
      redirectTo,
      client: authClient,
      request: args.request,
    });

    return await next(authClient, headers);
  }

  /**
   * @description 로그인한 사용자가 아닌 경우 로그인 페이지로 리다이렉트합니다.
   * @param {RemixRunArgs} args
   * @param {Function} next
   */
  async unauthenticate<TData>(
    args: RemixRunArgs,
    next:
      | ((client: AuthClient, headers: Request["headers"]) => Promise<TData>)
      | ((client: AuthClient, headers: Request["headers"]) => TData),
  ) {
    const { authClient, headers } = auth.handler(args);

    await this.requireAnonymous(authClient);

    return await next(authClient, headers);
  }

  /**
   * @description 세션 정보를 업데이트합니다.
   * @param {AuthClient} client
   * @param {string} refreshToken
   */
  async refreshSession(client: AuthClient, refreshToken: string) {
    return await client.refreshSession({ refresh_token: refreshToken });
  }

  /**
   * @description 세션 정보를 가져옵니다.
   * @param {AuthClient} client
   */
  async getSession(client: AuthClient) {
    return await client.getSession();
  }

  /**
   * @description 유저 정보를 가져옵니다.
   * @param {AuthClient} client
   */
  async getUser(client: AuthClient) {
    return await client.getUser();
  }

  /**
   * @description 유저와 세션 정보를 가져옵니다.
   * @param {AuthClient} client
   */
  async getAuth(client: AuthClient) {
    const authData: Auth = {
      session: undefined,
      user: undefined,
    };

    const sessionData = await this.getSession(client);
    if (sessionData.error || !sessionData.session) {
      return authData;
    }

    const userData = await this.getUser(client);
    if (userData.error || !userData.user) {
      return authData;
    }

    Object.assign(authData, {
      session: sessionData.session,
      user: userData.user,
    });

    return authData;
  }

  /**
   * @description 로그인한 사용자가 아닌 경우 로그인 페이지로 리다이렉트합니다.
   * @param {CustomDataArgs} params
   */
  private async requireUser(params: RequireAuthParams) {
    const { user } = await this.getAuth(params.client);
    if (!user) {
      const requestUrl = new URL(params.request.url);
      params.redirectTo =
        params.redirectTo === null
          ? null
          : (params.redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`);
      const loginParams = params.redirectTo
        ? new URLSearchParams({ redirectTo: params.redirectTo })
        : null;
      const loginRedirect = ["/signin", loginParams?.toString()]
        .filter(Boolean)
        .join("?");
      throw redirect(loginRedirect);
    }
    return user;
  }

  /**
   * @description 세션이 없는 경우 로그인 페이지로 리다이렉트합니다.
   * @param {AuthClient} client
   */
  private async requireAnonymous(client: AuthClient) {
    const { session, user } = await this.getAuth(client);
    if (session && user) {
      throw redirect(PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT);
    }
  }
}

export const token = AuthMiddleware.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<AuthMiddleware>(token, {
  useClass: AuthMiddleware,
});
