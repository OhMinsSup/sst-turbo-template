import type { Session, SessionData, SessionStorage } from '@remix-run/node';
import { createCookieSessionStorage } from '@remix-run/node';

import { isTheme, Theme } from '~/context/useThemeContext';

const NAME = 'client-remix-with-solana.theme';

export const themeStorage: SessionStorage<SessionData, SessionData> =
  createCookieSessionStorage({
    cookie: {
      name: NAME,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secrets: [process.env.THEME_SECRET],
    },
  });

export async function getTheme(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  const themeValue = session.get('theme');
  return isTheme(themeValue) ? themeValue : Theme.LIGHT;
}

export async function setTheme(request: Request, theme: Theme) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  session.set('theme', theme);
  return session;
}

export async function commit(
  request: Request,
  session?: Session<SessionData, SessionData>,
) {
  const _session =
    session ?? (await themeStorage.getSession(request.headers.get('Cookie')));

  // expires in 1 year
  const expires = new Date(Date.now() + 31536000000);
  return themeStorage.commitSession(_session, { expires: expires });
}
