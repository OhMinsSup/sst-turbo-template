import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";

import { requireUser } from "~/.server/data/shared";
import { auth } from "~/.server/utils/auth";

export const loader = async (args: LoaderFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  await requireUser({
    client: authClient,
    request: args.request,
  });

  return data({ succes: true }, { headers });
};

export type RoutesLoaderData = typeof loader;
