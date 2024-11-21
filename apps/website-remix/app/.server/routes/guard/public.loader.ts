import type { LoaderFunctionArgs } from "@remix-run/node";

import {
  createRemixServerAuthClient,
  requireAnonymous,
} from "~/.server/utils/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();

  const client = createRemixServerAuthClient({
    request,
    headers,
  });

  await requireAnonymous(client);

  return {
    success: true,
  };
};

export type RoutesLoaderData = typeof loader;
