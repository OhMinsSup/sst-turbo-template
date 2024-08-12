import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { createTrpcServer } from "@template/trpc/remix";

import { privateConfig } from "~/config/config.private";
import { getApiClient } from "~/store/app";

export type {
  AppRouter,
  RouterInputs,
  RouterOutputs,
} from "@template/trpc/remix";
export {
  appRouter,
  createCaller,
  createTRPCContext,
  createTrpcServer,
} from "@template/trpc/remix";

export const trpcServer = (ctx: LoaderFunctionArgs | ActionFunctionArgs) => {
  return createTrpcServer(ctx.request, getApiClient(), privateConfig.token);
};
