import { type PlatformProxy } from "wrangler";
import { type AppLoadContext } from "@remix-run/cloudflare";
import { initializeSession } from "./app/.server/session.server";
import { initializeToast } from "./app/.server/utils/toast.server";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    env: Env;
    sessionStore: ReturnType<typeof initializeSession>;
    toastStore: ReturnType<typeof initializeToast>;
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare };
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
  const sessionStore = initializeSession(
    context.cloudflare.env.COOKIE_SESSION_SECRET
  );
  const toastStore = initializeToast(context.cloudflare.env.TOAST_SECRET);
  return {
    ...context,
    env: context.cloudflare.env,
    sessionStore,
    toastStore,
  };
};
