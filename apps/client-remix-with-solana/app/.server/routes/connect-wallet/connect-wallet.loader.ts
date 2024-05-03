import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { requireUserId } from '~/.server/utils/auth.server';
import { prisma } from '~/.server/utils/db.server';

export const connectWalletLoader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const wallets = await prisma.wallet.findMany({
    where: {
      userId,
    },
    select: {
      address: true,
    },
    orderBy: { address: 'asc' },
  });

  return json({
    status: 'success',
    result: { userId, wallets },
    message: null,
  });
};

export type RoutesLoaderData = typeof connectWalletLoader;
