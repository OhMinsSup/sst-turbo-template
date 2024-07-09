import { etcRouter } from "./router/etc";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  etc: etcRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
