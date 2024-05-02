import {
  type SessionStorage,
  type SessionData,
  createCookieSessionStorage,
} from "@remix-run/cloudflare";

const NAME = "solana.session";

export let sessionStorage: SessionStorage<SessionData, SessionData>;

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;

export const getSessionExpirationDate = () =>
  new Date(Date.now() + SESSION_EXPIRATION_TIME);

export function initializeSession(cookieSecret: string) {
  if (sessionStorage) {
    return sessionStorage;
  }

  sessionStorage = createCookieSessionStorage({
    cookie: {
      name: NAME,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secrets: [cookieSecret],
    },
  });

  return sessionStorage;
}

export function getSessionStorage() {
  if (!sessionStorage) {
    throw new Error("You must initialize the session storage first");
  }

  return sessionStorage;
}
