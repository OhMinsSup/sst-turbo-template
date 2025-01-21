import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";

export const loader = async (args: LoaderFunctionArgs) =>
  await container.resolve(WorkspaceController).findAllByFavorite(args);

export type RoutesLoaderData = typeof loader;
