import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { RootController } from "~/.server/routes/root/controllers/root.controller";

export const loader = async (args: LoaderFunctionArgs) => {
  const instance = container.resolve(RootController);
  return await instance.root(args);
};

export type RoutesLoaderData = typeof loader;
