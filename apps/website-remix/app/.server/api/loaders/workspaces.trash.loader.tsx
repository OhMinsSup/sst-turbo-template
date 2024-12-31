import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import type { RoutesLoaderDataValue } from "~/.server/api/loaders/workspaces.loader";
import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";

export const loader = async (args: LoaderFunctionArgs) =>
  await container.resolve(WorkspaceController).findAllByDeletedToJson(args);

export type RoutesLoaderData = RoutesLoaderDataValue;
