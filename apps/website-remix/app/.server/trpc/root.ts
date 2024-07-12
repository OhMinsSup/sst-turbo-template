import { etcRouter } from "./router/etc";
import { usersRouter } from "./router/users";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  etc: etcRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
