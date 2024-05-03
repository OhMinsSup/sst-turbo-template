import { type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { parseWithZod } from "@conform-to/zod";
import { validateMethods } from "~/.server/utils/request.server";
import { navigation } from "~/constants/navigation";
import { schema } from "~/services/validate/register.validate";
import { prisma } from "~/.server/db.server";
import { hashPassword } from "~/.server/utils/password.server";
import {
  getSessionExpirationDate,
  getSessionStorage,
} from "~/.server/session.server";
import { sessionKey } from "~/.server/auth.server";
import { safeRedirect } from "remix-utils/safe-redirect";

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  // 유효성 검사
  validateMethods(request, ["POST"], navigation.register);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  // Report the submission to client if it is not successful
  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const { email, name, password } = submission.value;

    const exitsUser = await prisma.user.findFirst({
      select: { id: true, email: true, name: true },
      where: {
        email,
        name,
      },
    });

    // 이메일이 이미 존재하는 경우
    if (exitsUser) {
      const isEmail = exitsUser.email === email;
      const isName = exitsUser.name === name;
      return submission.reply({
        fieldErrors: {
          ...(isEmail && { email: ["이미 존재하는 이메일입니다."] }),
          ...(isName && { name: ["이미 존재하는 이름입니다."] }),
        },
      });
    }

    const hash = await hashPassword(password, "salt");

    const session = await prisma.session.create({
      data: {
        expirationDate: getSessionExpirationDate(),
        user: {
          create: {
            email: email.toLowerCase(),
            name: name.toLowerCase(),
            roles: {
              connectOrCreate: {
                where: { role: "USER" },
                create: { role: "USER" },
              },
            },
            password: {
              create: {
                hash,
              },
            },
          },
        },
      },
      select: { id: true, expirationDate: true },
    });

    const sessionStorage = getSessionStorage();

    const cookieSession = await sessionStorage.getSession(
      request.headers.get("cookie")
    );

    cookieSession.set(sessionKey, session.id);

    return redirect(safeRedirect(navigation.connectWallet), {
      headers: {
        "set-cookie": await sessionStorage.commitSession(cookieSession),
      },
    });
  } catch (e) {
    console.error(e);
    return submission.reply({
      fieldErrors: {
        email: ["회원가입에 실패했습니다. 다시 시도해주세요."],
      },
    });
  }
};

export type RoutesActionData = typeof registerAction;
