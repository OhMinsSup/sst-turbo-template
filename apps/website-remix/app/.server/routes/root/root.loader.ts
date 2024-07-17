import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { auth } from "@template/trpc/share";

import { TOKEN_KEY } from "~/.server/utils/constants";
import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { getApiClient } from "~/store/app";
import { getRequestInfo } from "~/utils";
import { combineHeaders } from "~/utils/misc";

export const loader = async ({ request, response }: LoaderFunctionArgs) => {
  const { toast, headers: toastHeaders } = await getToast(request);
  const requestInfo = getRequestInfo(request.headers);

  const { user, headers, status } = await auth({
    headers: request.headers,
    resHeaders: response?.headers ?? new Headers(),
    client: getApiClient(),
    tokenKey: TOKEN_KEY,
  });

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

  try {
    return json(data, {
      headers: combineHeaders(toastHeaders, headers),
    });
  } catch (error) {
    console.error("[loader] error", error);
    return json(data, {
      headers: combineHeaders(toastHeaders, headers),
    });
  }
};

export type RoutesLoaderData = typeof loader;
