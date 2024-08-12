import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { AuthKit, AuthKitFramework } from "@template/authkit";

import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { privateConfig } from "~/config/config.private";
import { getApiClient } from "~/store/app";
import { getRequestInfo } from "~/utils";
import { combineHeaders } from "~/utils/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers: toastHeaders } = await getToast(request);
  const requestInfo = getRequestInfo(request.headers);
  const authKit = new AuthKit({
    headers: request.headers,
    tokenKey: privateConfig.token,
    client: getApiClient(),
  });

  const cookie = request.headers.get("cookie");

  const { user, status, headers } = await authKit.checkAuth(
    cookie ? authKit.getTokens(cookie, AuthKitFramework.Remix) : null,
  );

  const data = {
    env: import.meta.env,
    requestInfo,
    userPrefs: {
      theme: getTheme(request),
    },
    toast,
    user,
    loggedInStatus: status,
  };

  return json(data, {
    headers: combineHeaders(toastHeaders, headers),
  });
};

export type RoutesLoaderData = typeof loader;
