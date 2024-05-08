import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { safeRedirect } from 'remix-utils/safe-redirect';
import { parseWithZod } from '@conform-to/zod';

import { sessionKey } from '~/.server/auth/auth.server';
import { hashPassword } from '~/.server/auth/password.server';
import {
  getSessionExpirationDate,
  sessionStorage,
} from '~/.server/auth/session.server';
import { prisma } from '~/.server/db/db.server';
import { validateMethods } from '~/.server/http/request.server';
import { navigation } from '~/constants/navigation';
import { generatorName } from '~/services/misc';
import { schema } from '~/services/validate/register.validate';

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  // 유효성 검사
  validateMethods(request, ['POST'], navigation.register);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  // Report the submission to client if it is not successful
  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const { email, username, password } = submission.value;

    const exitsUser = await prisma.user.findFirst({
      select: { id: true, email: true, username: true },
      where: {
        email,
        username,
      },
    });

    // 이메일이 이미 존재하는 경우
    if (exitsUser) {
      const isEmail = exitsUser.email === email;
      const isUsername = exitsUser.username === username;
      return submission.reply({
        fieldErrors: {
          ...(isEmail && { email: ['이미 존재하는 이메일입니다.'] }),
          ...(isUsername && { username: ['이미 존재하는 이름입니다.'] }),
        },
      });
    }

    const hash = await hashPassword(password, 'salt');

    const session = await prisma.session.create({
      data: {
        expirationDate: getSessionExpirationDate(),
        user: {
          create: {
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            name: generatorName(username.toLowerCase()),
            roles: {
              connectOrCreate: {
                where: { role: 'USER' },
                create: { role: 'USER' },
              },
            },
            password: {
              create: {
                hash,
              },
            },
            profile: {
              create: {},
            },
          },
        },
      },
      select: { id: true, expirationDate: true },
    });

    const cookieSession = await sessionStorage.getSession(
      request.headers.get('cookie'),
    );

    cookieSession.set(sessionKey, session.id);

    return redirect(safeRedirect(navigation.connectWallet), {
      headers: {
        'set-cookie': await sessionStorage.commitSession(cookieSession),
      },
    });
  } catch (e) {
    console.error(e);
    return submission.reply({
      fieldErrors: {
        email: ['회원가입에 실패했습니다. 다시 시도해주세요.'],
      },
    });
  }
};

export type RoutesActionData = typeof registerAction;
