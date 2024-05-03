import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { initializeTheme, getTheme } from "~/.server/utils/theme.server";
import { getToast } from "~/.server/utils/toast.server";
import { combineHeaders } from "~/.server/utils/request.server";
import { getUserId } from "~/.server/auth.server";
import { prisma } from "~/.server/db.server";

export const rootLoader = async ({ request, context }: LoaderFunctionArgs) => {
  initializeTheme(context.env.THEME_SECRET);

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
    theme: await getTheme(request),
    user,
    toast,
  };

  return json(loaderData, {
    headers: combineHeaders(toastHeaders),
  });
};

export type RoutesLoaderData = typeof rootLoader;
