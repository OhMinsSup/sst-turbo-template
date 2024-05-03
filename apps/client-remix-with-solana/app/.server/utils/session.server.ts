import type { SessionData, SessionStorage } from '@remix-run/node';
import { createCookieSessionStorage } from '@remix-run/node';

const NAME = 'client-remix-with-solana.session';

export const sessionStorage: SessionStorage<SessionData, SessionData> =
  createCookieSessionStorage({
    cookie: {
      name: NAME,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secrets: [process.env.COOKIE_SESSION_SECRET],
    },
  });

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;

export const getSessionExpirationDate = () =>
  new Date(Date.now() + SESSION_EXPIRATION_TIME);
