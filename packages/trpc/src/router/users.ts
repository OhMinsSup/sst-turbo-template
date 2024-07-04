import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const usersRouter = {
  me: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.client
      .rpc("me")
      .setAuthToken(ctx.session.user.accessToken)
      .get();
  }),
} satisfies TRPCRouterRecord;
