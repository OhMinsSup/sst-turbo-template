import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { RootController } from "~/.server/routes/root/controllers/root.controller";

export const loader = (args: LoaderFunctionArgs) =>
  container.resolve(RootController).empty(args);

export type RoutesLoaderData = typeof loader;
