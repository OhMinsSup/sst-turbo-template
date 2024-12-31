import type { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import type { components } from "@template/api-types";

import { WorkspaceController } from "~/.server/routes/workspaces/controllers/workspace.controller";

export const loader = async (args: LoaderFunctionArgs) =>
  await container.resolve(WorkspaceController).findAllToJson(args);

export interface RoutesLoaderDataValue {
  list: components["schemas"]["WorkspaceEntity"][];
  pageInfo: components["schemas"]["PageInfoDto"];
  totalCount: number;
  success: boolean;
}

export type RoutesLoaderData = RoutesLoaderDataValue;
