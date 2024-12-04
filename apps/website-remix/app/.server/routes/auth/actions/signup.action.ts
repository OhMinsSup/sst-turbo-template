import type { ActionFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { AuthController } from "~/.server/routes/auth/controllers/auth.controller";

export const action = async (args: ActionFunctionArgs) => {
  const instance = container.resolve(AuthController);
  return await instance.signUp(args);
};

export type RoutesActionData = typeof action;
