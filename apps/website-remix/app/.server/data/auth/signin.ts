import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import type { paths } from "@template/api-types";
import type { AuthClient } from "@template/auth";
import { HttpResultCode, HttpStatusCode } from "@template/common";

import type { CustomAuthDataArgs } from "~/.server/data/shared";
import { invariantToastError } from "~/.server/data/shared";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import {
  defaultToastErrorMessage,
  toErrorFormat,
  toValidationErrorFormat,
} from "~/libs/error";

interface SignInParams {
  authClient: AuthClient;
  requestBody: paths["/api/v1/auth/signIn"]["post"]["requestBody"]["content"]["application/json"];
}

export const signInApi = ({ authClient, requestBody }: SignInParams) => {
  return authClient.signIn(requestBody);
};

export const signInRequestBody = async (request: Request) => {
  const formData = await request.formData();
  return {
    email: formData.get("email"),
    password: formData.get("password"),
    provider: formData.get("provider"),
  } as paths["/api/v1/auth/signIn"]["post"]["requestBody"]["content"]["application/json"];
};

export const signIn = async (params: SignInParams) => {
  const { data, error, session } = await signInApi(params);
  if (error) {
    return [false, error, session] as const;
  }
  return [true, data, session] as const;
};

export const signInAction = async (
  args: ActionFunctionArgs,
  { authClient, headers }: CustomAuthDataArgs,
) => {
  const [ok, result] = await signIn({
    authClient: authClient,
    requestBody: await signInRequestBody(args.request),
  });

  if (!ok) {
    switch (result.statusCode) {
      case HttpStatusCode.NOT_FOUND: {
        return {
          success: false,
          error: toErrorFormat("email", result),
        };
      }
      case HttpStatusCode.BAD_REQUEST: {
        return {
          success: false,
          error:
            result.resultCode === HttpResultCode.INCORRECT_PASSWORD
              ? toErrorFormat("password", result)
              : toValidationErrorFormat(result),
        };
      }
      default: {
        throw invariantToastError(
          defaultToastErrorMessage(result.error.message),
          {
            request: args.request,
            headers,
          },
        );
      }
    }
  }

  throw redirect(PAGE_ENDPOINTS.ROOT, {
    headers,
  });
};
