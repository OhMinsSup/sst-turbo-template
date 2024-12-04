import { redirect } from "@remix-run/node";

import type { components } from "@template/api-types";
import type { AuthClient, Session, User } from "@template/auth";
import type { Method } from "@template/common";

import type { ToastInput } from "~/.server/utils/toast";
import { redirectWithToast } from "~/.server/utils/toast";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { defaultToastErrorMessage } from "~/libs/error";

export interface CustomDataArgs {
  session: Session;
  headers: Request["headers"];
  useCache?: boolean;
}
export interface CustomAuthDataArgs {
  authClient: AuthClient;
  headers: Request["headers"];
}

/**
 * @description 리스트 데이터의 기본값을 반환합니다.
 */
export const defaultListData = () => {
  return {
    list: [],
    totalCount: 0,
    pageInfo: {
      currentPage: 1,
      hasNextPage: false,
      nextPage: null,
    } as components["schemas"]["PageInfoDto"],
  };
};

/**
 * @description 메소드 타입을 대문자로 변환 후 "Method" 타입으로 반환합니다.
 * @param {Request} request
 * @returns {Method}
 */
export const getTypeSafeMethod = (request: Request): Method => {
  return request.method.toLocaleUpperCase() as Method;
};

interface InvariantParams {
  request: Request;
  headers: Request["headers"];
}

/**
 * @description 에러 토스트와 함께 리다이렉트합니다.
 * @param {ToastInput} toastInput
 * @param {InvariantParams} params
 */
export function invariantToastError(
  toastInput: ToastInput,
  {
    request,
    headers,
    redirectTo: redirectToParam,
  }: InvariantParams & {
    redirectTo?: string;
  },
) {
  const redirectTo = redirectToParam ?? request.url;
  return redirectWithToast(redirectTo, toastInput, {
    headers,
  });
}

type InvariantdMethodParams = InvariantParams;

/**
 * @description 지원하지 않는 메소드일 경우 리다이렉트합니다.
 * @param {InvariantdMethodParams} params
 */
export function invariantUnsupportedMethod({
  request,
  headers,
}: InvariantdMethodParams) {
  const reirectTo = request.url;
  const message = defaultToastErrorMessage("지원하지 않는 메소드입니다.");
  return redirectWithToast(reirectTo, message, {
    headers,
  });
}

type InvariantSessionParams = InvariantParams;

/**
 * @description 세션이 없을 경우 리다이렉트합니다.
 * @param {unknown} condition
 * @param {InvariantSessionParams} params
 */
export function invariantSession(
  condition: unknown,
  { headers, request }: InvariantSessionParams,
): asserts condition is Session {
  if (!condition) {
    const redirectTo = `${PAGE_ENDPOINTS.AUTH.SIGNIN}?redirectTo=${request.url}`;
    throw redirect(redirectTo, {
      headers,
    });
  }
}

/**
 * @description 세션을 가져옵니다.
 * @param {AuthClient} client
 */
export async function getSession(client: AuthClient) {
  return await client.getSession();
}

/**
 * @description 유저 정보를 가져옵니다.
 * @param {AuthClient} client
 */
export async function getUser(client: AuthClient) {
  return await client.getUser();
}

export interface Auth {
  session: Session | undefined;
  user: User | undefined;
}

/**
 * @description 유저와 세션 정보를 가져옵니다.
 * @param {AuthClient} client
 */
export async function getAuth(client: AuthClient): Promise<Auth> {
  const authData: Auth = {
    session: undefined,
    user: undefined,
  };

  const sessionData = await getSession(client);
  if (sessionData.error || !sessionData.session) {
    return authData;
  }

  const userData = await getUser(client);
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
 * @description 로그인한 사용자가 접근하면 대시보드로 리다이렉트합니다.
 * @param {AuthClient} client
 */
export async function requireAnonymous(client: AuthClient) {
  const { session, user } = await getAuth(client);
  if (session && user) {
    throw redirect(PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT);
  }
}

interface RequireAuthParams {
  redirectTo?: string | null;
  client: AuthClient;
  request: Request;
}

/**
 * @description 세션이 없는 경우 로그인 페이지로 리다이렉트합니다.
 * @param {CustomDataArgs} params
 */
export async function requireSession(params: RequireAuthParams) {
  const { session } = await getSession(params.client);
  if (!session) {
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
  return session;
}

/**
 * @description 로그인한 사용자가 아닌 경우 로그인 페이지로 리다이렉트합니다.
 * @param {CustomDataArgs} params
 */
export async function requireUser(params: RequireAuthParams) {
  const { user } = await getAuth(params.client);
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
