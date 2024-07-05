import { unstable_defineAction as defineAction } from "@remix-run/node";

export const action = defineAction(async ({ request, context }) => {
  return {};
});

export type RoutesActionData = typeof action;
