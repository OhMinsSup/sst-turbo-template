import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import type { GetAllCookies, SetAllCookies } from "../../storages/cookie/types";
import type { AuthClientOptions } from "../../types";
import {
  createAuthServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "../../server";

interface AuthCookie {
  getAll: (headers: Request["headers"]) => ReturnType<GetAllCookies>;
  setAll: (
    headers: Request["headers"],
    cookiesToSet: Parameters<SetAllCookies>[0],
  ) => void;
}

interface RemixAuthOptions {
  debug?: AuthClientOptions["logDebugMessages"];
  api: AuthClientOptions["api"];
}

interface AuthContext extends RemixAuthOptions {
  authCookies: AuthCookie;
}

type requestHandlerParams = (LoaderFunctionArgs | ActionFunctionArgs) & {
  remixAuthCtx: AuthContext;
};

export const getContext = (options: RemixAuthOptions): AuthContext => {
  const authCookies: AuthCookie = {
    getAll(headers) {
      return parseCookieHeader(headers.get("Cookie") ?? "");
    },
    setAll(headers, cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) =>
        headers.append(
          "Set-Cookie",
          serializeCookieHeader(name, value, options),
        ),
      );
    },
  };

  const ctx: AuthContext = {
    ...options,
    debug: options.debug ?? false,
    authCookies,
  };

  return ctx;
};

export const requestHandler = ({
  remixAuthCtx: ctx,
  ...params
}: requestHandlerParams) => {
  const headers = new Headers();

  const authClient = createAuthServerClient({
    api: ctx.api,
    logDebugMessages: ctx.debug,
    cookies: {
      getAll() {
        return ctx.authCookies.getAll(params.request.headers);
      },
      setAll(cookiesToSet) {
        ctx.authCookies.setAll(headers, cookiesToSet);
      },
    },
  });

  return {
    authClient,
    headers,
  };
};

export const remixAuth = (options: RemixAuthOptions) => {
  const remixAuthCtx = getContext(options);
  return {
    handler: (params: LoaderFunctionArgs | ActionFunctionArgs) => {
      return requestHandler({
        remixAuthCtx,
        ...params,
      });
    },
    getContext: () => remixAuthCtx,
  };
};
