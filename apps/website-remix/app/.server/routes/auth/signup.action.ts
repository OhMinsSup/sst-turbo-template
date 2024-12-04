import type { ActionFunctionArgs } from "@remix-run/node";

import { signUpAction } from "~/.server/data/auth/signup";
import { auth } from "~/.server/utils/auth";

export const action = async (args: ActionFunctionArgs) => {
  return await signUpAction(args, auth.handler(args));
};

export type RoutesActionData = typeof action;
