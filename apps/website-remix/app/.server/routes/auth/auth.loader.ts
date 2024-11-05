import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  createRemixServerClient,
  requireAnonymous,
} from "~/.server/utils/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();

  const client = createRemixServerClient({
    request,
    headers,
  });

  await requireAnonymous(client);

  return json({
    success: true,
  });
};

export type RoutesLoaderData = typeof loader;
