import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import { combineHeaders, getRequestInfo } from "@template/utils/request";

import type { Theme } from "~/.server/utils/theme";
import { getAuth } from "~/.server/data/shared";
import { auth } from "~/.server/utils/auth";
import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { getHints } from "~/libs/client-hints";

export interface RequestInfo {
  hints: Record<string, string>;
  origin: string;
  path: string;
  userPrefs: {
    theme: Theme | null;
  };
}

export const loader = async (args: LoaderFunctionArgs) => {
  const toastData = await getToast(args.request);
  const { domainUrl } = getRequestInfo(args.request.headers);
  const { authClient, headers } = auth.handler(args);

  const requestInfo: RequestInfo = {
    hints: getHints(args.request),
    origin: domainUrl,
    path: new URL(args.request.url).pathname,
    userPrefs: {
      theme: getTheme(args.request),
    },
  };

  return data(
    {
      requestInfo,
      toast: toastData.toast,
      ...(await getAuth(authClient)),
    },
    {
      headers: combineHeaders(headers, toastData.headers),
    },
  );
};

export type RoutesLoaderData = typeof loader;
