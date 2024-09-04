import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const usersRouter = {
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.client
      .rpc("me")
      .setAuthToken(ctx.session.access_token)
      .get();
  }),
} satisfies TRPCRouterRecord;
