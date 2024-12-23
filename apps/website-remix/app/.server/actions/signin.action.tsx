import type { ActionFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { AuthController } from "../routes/auth/controllers/auth.controller";

export const action = async (args: ActionFunctionArgs) => {
  const instance = container.resolve(AuthController);
  return await instance.signIn(args);
};

export type RoutesActionData = typeof action;
