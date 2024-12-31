// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunction } from "@remix-run/node";
import { container } from "tsyringe";

import { RootController } from "~/.server/routes/root/controllers/root.controller";

export const loader: LoaderFunction = async (args) =>
  await container.resolve(RootController).health(args);

export type RoutesLoaderData = typeof loader;
