import type { components } from "@template/api-types";

export type HttpErrorData =
  | components["schemas"]["ValidationErrorDto"]
  | components["schemas"]["HttpErrorDto"];

type ToErrorFormat = HttpErrorData;

type ReturnErrorFormat = Record<
  string,
  {
    message: string;
  }
>;

/**
 * @description server side open-api error format with react-hook-form error format
 * @param {string} key
 * @param {ToErrorFormat} error
 * @returns {ReturnErrorFormat}
 */
export function toErrorFormat(
  key: string,
  error: ToErrorFormat,
): ReturnErrorFormat {
  const {
    error: { message },
  } = error;
  return {
    [key]: {
      message,
    },
  };
}

/**
 * @description server side open-api error format with react-hook-form error format
 * @param {HttpErrorData} error
 * @returns {ReturnErrorFormat}
 */
export function toValidationErrorFormat(
  error: HttpErrorData,
): ReturnErrorFormat {
  if ("validationErrorInfo" in error.error) {
    const { validationErrorInfo } = error.error;
    return Object.fromEntries(
      Object.entries(validationErrorInfo).map(([key, value]) => [
        key,
        {
          message: value,
        },
      ]),
    );
  }

  return Object.fromEntries(
    Object.entries(error).map(([key, value]) => [
      key,
      {
        message: value,
      },
    ]),
  );
}

/**
 * @description get error message from error object
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}
