import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const usersRouter = {
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
} satisfies TRPCRouterRecord;
