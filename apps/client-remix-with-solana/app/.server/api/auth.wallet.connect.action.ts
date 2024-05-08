import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { safeRedirect } from 'remix-utils/safe-redirect';
import { parseWithZod } from '@conform-to/zod';

import { requireUserId } from '~/.server/auth/auth.server';
import { validateWallet } from '~/.server/auth/password.server';
import { prisma } from '~/.server/db/db.server';
import { validateMethods } from '~/.server/http/request.server';
import { navigation } from '~/constants/navigation';
import { schema } from '~/services/validate/connect-wallet.validate';

export const action = async ({ request }: ActionFunctionArgs) => {
  validateMethods(request, ['POST']);

  const userId = await requireUserId(request);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  // Report the submission to client if it is not successful
  if (submission.status !== 'success') {
    return json({
      status: 'error' as const,
      result: null,
      message: submission.reply(),
    });
  }

  const { address, encoding } = submission.value;

  await validateWallet(userId, address, encoding);

  await prisma.wallet.upsert({
    where: { address },
    create: {
      address,
      userId,
      connectedAt: new Date(),
    },
    update: { userId: userId, connectedAt: new Date() },
    include: { user: true },
  });

  return redirect(safeRedirect(navigation.emailVerification));
};

export type RoutesActionData = typeof action;
