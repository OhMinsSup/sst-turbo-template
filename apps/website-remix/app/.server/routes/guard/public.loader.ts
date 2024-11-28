import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import { auth, requireAnonymous } from "~/.server/utils/auth";

export const loader = async (args: LoaderFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  await requireAnonymous(authClient);

  return data({ succes: true }, { headers });
};

export type RoutesLoaderData = typeof loader;
