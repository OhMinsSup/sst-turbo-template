import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { Session } from "@template/sdk/auth";

import { sessionStorage } from "~/.server/utils/session";
import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { SESSION_DATA_KEY } from "~/constants/constants";
import { getRequestInfo } from "~/utils";
import { combineHeaders } from "~/utils/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers: toastHeaders } = await getToast(request);
  const requestInfo = getRequestInfo(request.headers);

  const cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );

  const session = cookieSession.get(SESSION_DATA_KEY.dataKey) as
    | Session
    | undefined;

  console.log("#[root.loader] ==>", session);

  return json(
    {
      env: import.meta.env,
      requestInfo,
      userPrefs: {
        theme: getTheme(request),
      },
      toast,
      user: session ?? null,
    },
    {
      headers: combineHeaders(toastHeaders),
    },
  );
};

export type RoutesLoaderData = typeof loader;
