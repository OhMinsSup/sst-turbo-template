import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getRequestInfo } from "@template/utils/request";

import { createRemixServerClient } from "~/.server/utils/auth";
import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { combineHeaders } from "~/utils/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers: toastHeaders } = await getToast(request);
  const requestInfo = getRequestInfo(request.headers);

  const headers = new Headers();
  const client = createRemixServerClient({
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
      env: import.meta.env,
      requestInfo,
      userPrefs: {
        theme: getTheme(request),
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
