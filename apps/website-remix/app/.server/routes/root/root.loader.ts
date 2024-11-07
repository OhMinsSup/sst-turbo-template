import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { combineHeaders, getRequestInfo } from "@template/utils/request";

import { createRemixServerAuthClient } from "~/.server/utils/auth";
import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { getHints } from "~/utils/client-hints";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();

  const { toast, headers: toastHeaders } = await getToast(request);
  const requestInfo = getRequestInfo(request.headers);

  const client = createRemixServerAuthClient({
    request,
    headers,
  });

  const { session } = await client.getSession();

  const user = await (async function () {
    try {
      const { user } = await client.getUser();
      return user;
    } catch {
      return null;
    }
  })();

  return json(
    {
      requestInfo: {
        hints: getHints(request),
        origin: requestInfo.domainUrl,
        path: new URL(request.url).pathname,
        userPrefs: {
          theme: getTheme(request),
        },
      },
      toast,
      session,
      user,
    },
    {
      headers: combineHeaders(headers, toastHeaders),
    },
  );
};

export type RoutesLoaderData = typeof loader;
