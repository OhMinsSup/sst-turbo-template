import { createId as cuid } from "@paralleldrive/cuid2";
import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import { z } from "zod";
import { combineHeaders } from "./request.server.js";
import type {
  LoaderFunctionArgs,
  SessionData,
  SessionStorage,
} from "@remix-run/cloudflare";

export const NAME = "solana.toast";

export const toastKey = "toast";

const ToastSchema = z.object({
  description: z.string(),
  id: z.string().default(() => cuid()),
  title: z.string().optional(),
  type: z.enum(["message", "success", "error"]).default("message"),
});

export type Toast = z.infer<typeof ToastSchema>;
export type ToastInput = z.input<typeof ToastSchema>;

export let toastSessionStorage: SessionStorage<SessionData, SessionData>;

export function initializeToast(cookieSecret: string) {
  if (toastSessionStorage) {
    return toastSessionStorage;
  }

  toastSessionStorage = createCookieSessionStorage({
    cookie: {
      name: NAME,
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets: [cookieSecret],
    },
  });

  return toastSessionStorage;
}

export function getToastSessionStorage() {
  if (!toastSessionStorage) {
    throw new Error("You must initialize the toast session storage first");
  }

  return toastSessionStorage;
}

export async function redirectWithToast(
  url: string,
  toast: ToastInput,
  init?: ResponseInit
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
  });
}

export async function createToastHeaders(toastInput: ToastInput) {
  const toastStore = getToastSessionStorage();

  const session = await toastStore.getSession();
  const toast = ToastSchema.parse(toastInput);
  session.flash(toastKey, toast);
  const cookie = await toastStore.commitSession(session);
  return new Headers({ "set-cookie": cookie });
}

export async function getToast(request: Request) {
  const toastStore = getToastSessionStorage();
  const session = await toastStore.getSession(request.headers.get("cookie"));
  const result = ToastSchema.safeParse(session.get(toastKey));
  const toast = result.success ? result.data : null;
  return {
    toast,
    headers: toast
      ? new Headers({
          "set-cookie": await toastStore.destroySession(session),
        })
      : null,
  };
}
