import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const etcRouter = {
  hello: publicProcedure.query(({ ctx }) => {
    return "Hello, world!";
  }),
} satisfies TRPCRouterRecord;
