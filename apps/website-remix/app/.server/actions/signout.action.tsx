import type { ActionFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";

import { AuthController } from "~/.server/routes/auth/controllers/auth.controller";

export const loader = () => {
  throw new Response("Not found", { status: 404 });
};

export const action = async (args: ActionFunctionArgs) =>
  await container.resolve(AuthController).signOut(args);

export type RoutesActionData = typeof action;
