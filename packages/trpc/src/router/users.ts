import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const usersRouter = {
  me: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.client.users
      .rpc("getMe", {
        $fetchOptions: {
          headers: {
            Authorization: `Bearer ${ctx.session.user.accessToken}`,
          },
        },
      })
      .call();
  }),
} satisfies TRPCRouterRecord;
