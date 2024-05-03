import { json } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { requireUserId } from "~/.server/auth.server";
import { prisma } from "~/.server/db.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  try {
    const nonce = crypto.randomUUID();

    // nonce를 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: { nonce },
    });

    const signature = `${context.env.SIGN_MESSAGE}${nonce}`;

    return json({
      status: "success" as const,
      result: {
        signature,
      },
      message: "서명을 완료했습니다.",
    });
  } catch (error) {
    console.error(error);
    return json(
      {
        status: "error" as const,
        result: null,
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      {
        status: 500,
      }
    );
  }
};

export type RoutesLoaderData = typeof loader;

export const getPath = (address: string) => {
  return `/api/v1/auth/wallet/request-password/${address}`;
};
