import { createCookieSessionStorage } from "@remix-run/node";
import { NODE_ENV, SESSION_SECRET } from "$env/static/private";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "template.session-token",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: SESSION_SECRET.split(","),
    secure: NODE_ENV === "production",
  },
});

// we have to do this because every time you commit the session you overwrite it
// so we store the expiration time in the cookie and reset it every time we commit
const originalCommitSession = sessionStorage.commitSession;

Object.defineProperty(sessionStorage, "commitSession", {
  value: async function commitSession(
    ...args: Parameters<typeof originalCommitSession>
  ) {
    const [session, options] = args;
    if (options?.expires) {
      session.set("expires", options.expires);
    }
    if (options?.maxAge) {
      session.set("expires", new Date(Date.now() + options.maxAge * 1000));
    }
    const expires = session.has("expires")
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        new Date(session.get("expires"))
      : undefined;
    const setCookieHeader = await originalCommitSession(session, {
      ...options,
      expires,
    });
    return setCookieHeader;
  },
});
