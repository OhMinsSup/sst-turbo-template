import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { HttpStatusCode, isAuthError } from "@template/common";
import { combineHeaders } from "@template/utils/request";

import { auth, requireUserId } from "~/.server/utils/auth";
import { redirectWithToast } from "~/.server/utils/toast";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export const loader = () => {
  throw new Response("Not found", { status: 404 });
};

export const action = async (args: ActionFunctionArgs) => {
  const { authClient, headers } = auth.handler(args);

  await requireUserId({
    client: authClient,
    request: args.request,
  });

  const formData = await args.request.formData();

  const redirectTo = formData.get("redirectTo") as string;

  const result = await authClient.signOut();

  if (isAuthError(result.error)) {
    return redirectWithToast(redirectTo, {
      type: "error",
      title: "인증 오류",
      description: "세션 정보가 없거나 토큰이 유효하지 않습니다.",
    });
  }

  if (result.error?.error) {
    switch (result.error.statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return redirectWithToast(redirectTo, {
          type: "error",
          title: "인증 오류",
          description: "유저가 존재하지 않습니다.",
        });
      }
      case HttpStatusCode.UNAUTHORIZED: {
        return redirectWithToast(redirectTo, {
          type: "error",
          title: "인증 오류",
          description: "세션 정보가 없거나 토큰이 유효하지 않습니다.",
        });
      }
      case HttpStatusCode.BAD_REQUEST: {
        return redirectWithToast(redirectTo, {
          type: "error",
          title: "인증 오류",
          description: "토큰값이 유효하지 않습니다.",
        });
      }
      default: {
        return redirectWithToast(redirectTo, {
          type: "error",
          title: "서버 오류",
          description: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    }
  }
  return redirect(PAGE_ENDPOINTS.AUTH.SIGNIN, {
    headers: combineHeaders(headers),
  });
};

export type RoutesActionData = typeof action;
