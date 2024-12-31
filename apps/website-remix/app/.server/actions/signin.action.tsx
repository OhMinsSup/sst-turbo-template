import type { ActionFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { AuthController } from "~/.server/routes/auth/controllers/auth.controller";

export const action = async (args: ActionFunctionArgs) =>
  await container.resolve(AuthController).signIn(args);

export type RoutesActionData = typeof action;
