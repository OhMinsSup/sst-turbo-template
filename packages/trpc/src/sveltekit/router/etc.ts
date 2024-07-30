import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const etcRouter = {
  hello: publicProcedure.query(() => {
    return "Hello, world!";
  }),
} satisfies TRPCRouterRecord;
