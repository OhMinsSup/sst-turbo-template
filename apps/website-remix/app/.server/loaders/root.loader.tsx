import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { RootController } from "~/.server/routes/root/controllers/root.controller";

export const loader = async (args: LoaderFunctionArgs) =>
  await container.resolve(RootController).root(args);

export type RoutesLoaderData = typeof loader;
