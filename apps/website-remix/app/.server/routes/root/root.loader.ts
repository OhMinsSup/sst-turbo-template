import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getAuthFromRequest, validateRefreshToken } from "~/.server/utils/auth";
import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { getRequestInfo } from "~/utils";
import { combineHeaders } from "~/utils/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers: toastHeaders } = await getToast(request);
  const requestInfo = getRequestInfo(request.headers);

  const user = await getAuthFromRequest(request);

  const data = {
    env: import.meta.env,
    requestInfo,
    userPrefs: {
      theme: getTheme(request),
    },
    toast,
    user,
  };

  if (user) {
    // refres
    await validateRefreshToken(request);
  }

  try {
    return json(data, {
      headers: combineHeaders(toastHeaders),
    });
  } catch (error) {
    return json(data, {
      headers: combineHeaders(toastHeaders),
    });
  }
};

export type RoutesLoaderData = typeof loader;
