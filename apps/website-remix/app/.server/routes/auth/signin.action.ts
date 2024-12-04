import type { ActionFunctionArgs } from "@remix-run/node";

import { signInAction } from "~/.server/data/auth/signin";
import { auth } from "~/.server/utils/auth";

export const action = async (args: ActionFunctionArgs) => {
  return await signInAction(args, auth.handler(args));
};

export type RoutesActionData = typeof action;
