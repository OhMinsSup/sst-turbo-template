"use server";

import type { FieldErrors } from "react-hook-form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ClientResponse, FormFieldSignUpSchema } from "@template/sdk";
import { HttpResultStatus, isFetchError } from "@template/sdk";

import { PAGE_ENDPOINTS } from "~/constants/constants";
import { createClient } from "~/libs/auth/server";

type ZodValidateError = FieldErrors<FormFieldSignUpSchema>;

export type State = ZodValidateError | undefined | boolean;

const defaultErrorMessage = {
  email: {
    message: "인증에 실패했습니다. 이메일을 확인해주세요.",
  },
};

export async function submitAction(_: State, input: FormFieldSignUpSchema) {
  let isRedirect = false;

  const client = createClient();

  try {
    await client.signUp(input, true);

    isRedirect = true;
  } catch (error) {
    isRedirect = false;
    if (isFetchError<ClientResponse>(error) && error.data) {
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
      revalidatePath("/", "layout");
      redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
    }
  }
}
