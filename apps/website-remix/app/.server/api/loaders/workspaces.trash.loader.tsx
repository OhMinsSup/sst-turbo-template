import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import type { RoutesLoaderDataValue } from "./workspaces.loader";
import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";

export const loader = async (args: LoaderFunctionArgs) => {
  const instance = container.resolve(WorkspaceController);
  return await instance.findAllByDeletedToJson(args);
};

export type RoutesLoaderData = RoutesLoaderDataValue;
