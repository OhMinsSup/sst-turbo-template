import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { createId as cuid } from "@paralleldrive/cuid2";
import { z } from "zod";

import { combineHeaders } from "@template/utils/request";

import { privateConfig } from "~/config/config.private";
import { SESSION_DATA_KEY } from "~/constants/constants";

export const toastKey = "toast";

const ToastSchema = z.object({
  description: z.string(),
  id: z.string().default(() => cuid()),
  title: z.string().optional(),
  type: z.enum(["message", "success", "error"]).default("message"),
});

export type Toast = z.infer<typeof ToastSchema>;
export type ToastInput = z.input<typeof ToastSchema>;

export const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    name: SESSION_DATA_KEY.toastKey,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [privateConfig.sessionSecret],
    secure: privateConfig.isProd,
  },
});

export async function redirectWithToast(
  url: string,
  toast: ToastInput,
  init?: ResponseInit,
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
  });
}

export async function createToastHeaders(
  toastInput: ToastInput,
): Promise<Headers> {
  const session = await toastSessionStorage.getSession();
  const toast = ToastSchema.parse(toastInput);
  session.flash(toastKey, toast);
  const cookie = await toastSessionStorage.commitSession(session);
  return new Headers({ "set-cookie": cookie });
}

export interface ToastWithHeaders {
  toast: Toast | null;
  headers: Headers | null;
}

export async function getToast(request: Request): Promise<ToastWithHeaders> {
  const session = await toastSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const result = ToastSchema.safeParse(session.get(toastKey));
  const toast = result.success ? result.data : null;
  return {
    toast,
    headers: toast
      ? new Headers({
          "set-cookie": await toastSessionStorage.destroySession(session),
        })
      : null,
  };
}
