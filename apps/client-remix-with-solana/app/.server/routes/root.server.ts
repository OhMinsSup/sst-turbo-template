import os from 'node:os';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { getUserId } from '~/.server/auth/auth.server';
import { prisma } from '~/.server/db/db.server';
import { getUserSelector } from '~/.server/db/selectors/users';
import { combineHeaders } from '~/.server/http/request.server';
import { getEnv } from '~/.server/utils/env.server';
import { commit, getTheme, setTheme } from '~/.server/utils/theme.server';
import { getToast } from '~/.server/utils/toast.server';
import { isTheme } from '~/context/useThemeContext';
import { invariantResponse } from '~/services/misc';

export const rootLoader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers: toastHeaders } = await getToast(request);

  const userId = await getUserId(request);
  const user = userId
    ? await prisma.user.findUniqueOrThrow({
        select: getUserSelector(),
        where: { id: userId },
      })
    : null;

  const loaderData = {
    username: os.userInfo().username,
    user,
    toast,
    theme: await getTheme(request),
    ENV: getEnv(),
  };

  return json(loaderData, {
    headers: combineHeaders(toastHeaders),
  });
};

export type RoutesLoaderData = typeof rootLoader;

export async function rootAction({ request }: ActionFunctionArgs) {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get('theme');

  invariantResponse(isTheme(theme), 'Invalid theme received');

  const session = await setTheme(request, theme);

  const responseInit = {
    headers: { 'set-cookie': await commit(request, session) },
  };

  return json(
    {
      status: 'success' as const,
      result: null,
      message: null,
    },
    responseInit,
  );
}

export type RoutesActionData = typeof rootAction;
