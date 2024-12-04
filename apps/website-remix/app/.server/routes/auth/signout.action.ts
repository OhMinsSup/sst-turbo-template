import type { ActionFunctionArgs } from "@remix-run/node";

import { signOutAction } from "~/.server/data/auth/signout";
import { auth } from "~/.server/utils/auth";

export const loader = () => {
  throw new Response("Not found", { status: 404 });
};

export const action = async (args: ActionFunctionArgs) => {
  return await signOutAction(args, auth.handler(args));
};

export type RoutesActionData = typeof action;
