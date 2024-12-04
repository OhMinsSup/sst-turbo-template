import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import type { paths } from "@template/api-types";
import type { AuthClient } from "@template/auth";
import { HttpStatusCode } from "@template/common";

import type { CustomAuthDataArgs } from "~/.server/data/shared";
import { invariantToastError } from "~/.server/data/shared";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import {
  defaultToastErrorMessage,
  toErrorFormat,
  toValidationErrorFormat,
} from "~/libs/error";

interface SignUpParams {
  authClient: AuthClient;
  requestBody: paths["/api/v1/auth/signUp"]["post"]["requestBody"]["content"]["application/json"];
}

export const signUpApi = ({ authClient, requestBody }: SignUpParams) => {
  return authClient.signUp(requestBody);
};

export const signUpRequestBody = async (request: Request) => {
  const formData = await request.formData();
  return {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    username: formData.get("username"),
    provider: formData.get("provider"),
  } as paths["/api/v1/auth/signUp"]["post"]["requestBody"]["content"]["application/json"];
};

export const signUp = async (params: SignUpParams) => {
  const { data, error, session } = await signUpApi(params);
  if (error) {
    return [false, error, session] as const;
  }
  return [true, data, session] as const;
};

export const signUpAction = async (
  args: ActionFunctionArgs,
  { authClient, headers }: CustomAuthDataArgs,
) => {
  const [ok, result] = await signUp({
    authClient: authClient,
    requestBody: await signUpRequestBody(args.request),
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
          error: toValidationErrorFormat(result),
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
