"use server";

import type { FieldErrors } from "react-hook-form";
import { redirect } from "next/navigation";

import type { ClientResponse } from "@template/sdk";
import type { FormFieldSignUpSchema } from "@template/sdk/schema";
import { HttpResultStatus } from "@template/sdk/enum";
import { isAppError, isHttpError } from "@template/sdk/error";

import { PAGE_ENDPOINTS } from "~/constants/constants";
import { getApiClient } from "~/contexts/app";

type ZodValidateError = FieldErrors<FormFieldSignUpSchema>;

export type State = ZodValidateError | undefined | boolean;

const defaultErrorMessage = {
  email: {
    message: "인증에 실패했습니다. 이메일을 확인해주세요.",
  },
};

export async function submitAction(_: State, input: FormFieldSignUpSchema) {
  let isRedirect = false;

  try {
    await getApiClient().rpc("signUp").post(input);
    isRedirect = true;
    return true;
  } catch (error) {
    isRedirect = false;
    if (isAppError<ZodValidateError>(error) && error.data) {
      return error.data as State;
    }

    if (isHttpError<ClientResponse>(error) && error.data) {
      switch (error.data.resultCode) {
        case HttpResultStatus.INVALID: {
          return (
            Array.isArray(error.data.message)
              ? error.data.message.at(0)
              : defaultErrorMessage
          ) as State;
        }
        case HttpResultStatus.NOT_EXIST: {
          return error.data.message as State;
        }
        default: {
          return defaultErrorMessage as State;
        }
      }
    }
  } finally {
    if (isRedirect) {
      redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
    }
  }
}
