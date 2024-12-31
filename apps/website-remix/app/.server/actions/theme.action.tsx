import type { ActionFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { RootController } from "~/.server/routes/root/controllers/root.controller";

export const action = async (args: ActionFunctionArgs) =>
  await container.resolve(RootController).theme(args);

export type RoutesActionData = typeof action;
