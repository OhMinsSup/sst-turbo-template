import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { AuthMiddleware } from "~/.server/middlewares/auth.middleware";

export const loader = async (args: LoaderFunctionArgs) =>
  await container
    .resolve(AuthMiddleware)
    .authenticate(args, () => new Response(null, { status: 200 }));

export type RoutesLoaderData = typeof loader;
