import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  createRemixServerAuthClient,
  requireUserId,
} from "~/.server/utils/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();

  const client = createRemixServerAuthClient({
    request,
    headers,
  });

  await requireUserId({
    client,
    request,
  });

  return json({
    success: true,
  });
};

export type RoutesLoaderData = typeof loader;
