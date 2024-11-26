import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import { combineHeaders, getRequestInfo } from "@template/utils/request";

import type { Theme } from "~/.server/utils/theme";
import {
  createRemixServerAuthClient,
  getUserAndSession,
} from "~/.server/utils/auth";
import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { getHints } from "~/utils/client-hints";

export interface RequestInfo {
  hints: Record<string, string>;
  origin: string;
  path: string;
  userPrefs: {
    theme: Theme | null;
  };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();

  const toastData = await getToast(request);
  const { domainUrl } = getRequestInfo(request.headers);

  const client = createRemixServerAuthClient({
    request,
    headers,
  });

  const auth = await getUserAndSession(client);

  const requestInfo: RequestInfo = {
    hints: getHints(request),
    origin: domainUrl,
    path: new URL(request.url).pathname,
    userPrefs: {
      theme: getTheme(request),
    },
  };

  return data(
    {
      requestInfo,
      toast: toastData.toast,
      session: auth.session,
      user: auth.user,
    },
    {
      headers: combineHeaders(headers, toastData.headers),
    },
  );
};

export type RoutesLoaderData = typeof loader;
