import { authRouter } from "./router/auth";
import { etcRouter } from "./router/etc";
import { usersRouter } from "./router/users";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  etc: etcRouter,
  users: usersRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
