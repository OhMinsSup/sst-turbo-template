import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { requireUserId } from "~/.server/auth.server";
import { prisma } from "~/.server/db.server";

export const connectWalletLoader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const wallets = await prisma.wallet.findMany({
    where: {
      userId,
    },
    select: {
      address: true,
    },
    orderBy: { address: "asc" },
  });

  return json({
    status: "success",
    result: { userId, wallets },
    message: null,
  });
};

export type RoutesLoaderData = typeof connectWalletLoader;
