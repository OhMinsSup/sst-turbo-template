import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import type { AuthClient } from "@template/auth";
import { HttpStatusCode, isAuthError } from "@template/common";

import type { CustomAuthDataArgs } from "~/.server/data/shared";
import { invariantToastError, requireUser } from "~/.server/data/shared";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { defaultToastErrorMessage } from "~/libs/error";

interface SignOutParams {
  authClient: AuthClient;
}

export const signOutApi = ({ authClient }: SignOutParams) => {
  return authClient.signOut();
};

export const signOut = async (params: SignOutParams) => {
  const { error } = await signOutApi(params);
  if (error) {
    return [false, error] as const;
  }
  return [true, null] as const;
};

export const signOutAction = async (
  args: ActionFunctionArgs,
  { authClient, headers }: CustomAuthDataArgs,
) => {
  await requireUser({
    client: authClient,
    request: args.request,
  });

  const formData = await args.request.formData();

  const redirectTo = formData.get("redirectTo") as string;

  const [ok, result] = await signOut({
    authClient: authClient,
  });

  if (isAuthError(result)) {
    throw invariantToastError(
      defaultToastErrorMessage("세션 정보가 없거나 토큰이 유효하지 않습니다."),

      {
        request: args.request,
        headers,
        redirectTo,
      },
    );
  }

  if (!ok) {
    switch (result.statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        throw invariantToastError(
          defaultToastErrorMessage("유저가 존재하지 않습니다."),
          {
            request: args.request,
            headers,
            redirectTo,
          },
        );
      }
      case HttpStatusCode.UNAUTHORIZED: {
        throw invariantToastError(
          defaultToastErrorMessage(
            "세션 정보가 없거나 토큰이 유효하지 않습니다.",
          ),
          {
            request: args.request,
            headers,
            redirectTo,
          },
        );
      }
      case HttpStatusCode.BAD_REQUEST: {
        throw invariantToastError(
          defaultToastErrorMessage("토큰값이 유효하지 않습니다."),
          {
            request: args.request,
            headers,
            redirectTo,
          },
        );
      }
      default: {
        throw invariantToastError(
          defaultToastErrorMessage(
            "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          ),
          {
            request: args.request,
            headers,
            redirectTo,
          },
        );
      }
    }
  }

  throw redirect(PAGE_ENDPOINTS.AUTH.SIGNIN, {
    headers,
  });
};
