import os from 'node:os';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { getUserId } from '~/.server/utils/auth.server';
import { prisma } from '~/.server/utils/db.server';
import { getEnv } from '~/.server/utils/env.server';
import { combineHeaders } from '~/.server/utils/request.server';
import { getTheme } from '~/.server/utils/theme.server';
import { getToast } from '~/.server/utils/toast.server';

export const rootLoader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers: toastHeaders } = await getToast(request);

  const userId = await getUserId(request);
  const user = userId
    ? await prisma.user.findUniqueOrThrow({
        select: {
          id: true,
          name: true,
        },
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
