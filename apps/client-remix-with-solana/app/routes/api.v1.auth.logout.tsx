import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { safeRedirect } from 'remix-utils/safe-redirect';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import { requireUserId } from '~/.server/utils/auth.server';
import { prisma } from '~/.server/utils/db.server';
import { validateWallet } from '~/.server/utils/password.server';
import { navigation } from '~/constants/navigation';

export const schema = z.object({
  address: z.string().min(1, {
    message: '잘못된 주소 형식입니다. 주소를 확인해주세요.',
  }),
  encoding: z.string().min(1, {
    message: '잘못된 서명 형식입니다. 서명을 확인해주세요.',
  }),
  signature: z.string().min(1, {
    message: '잘못된 서명 형식입니다. 서명을 확인해주세요.',
  }),
});

export type FormFieldValues = z.infer<typeof schema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  // Report the submission to client if it is not successful
  if (submission.status !== 'success') {
    return json({
      status: 'error' as const,
      result: submission.reply(),
      message: '잘못된 요청입니다. 주소와 서명을 확인해주세요.',
    });
  }

  const { address, encoding, signature } = submission.value;

  try {
    await validateWallet(userId, address, encoding, signature);

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
  } catch (error) {
    console.error('error', error);
    if (error instanceof Response) {
      const message = await error.text();
      return json(
        {
          status: 'error' as const,
          result: null,
          message,
        },
        {
          status: error.status,
        },
      );
    }

    return json(
      {
        status: 'error' as const,
        result: null,
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      {
        status: 500,
      },
    );
  }
};

export type RoutesActionData = typeof action;

export const loader = () => redirect('/', { status: 404 });

export const getPath = () => {
  return '/api/v1/auth/logout';
};

export default function Routes() {
  return <div>Oops... You should not see this.</div>;
}
