import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";

export const loader = async (args: LoaderFunctionArgs) => {
  const instance = container.resolve(WorkspaceController);
  return await instance.findAll(args);
};

export type RoutesLoaderData = typeof loader;
