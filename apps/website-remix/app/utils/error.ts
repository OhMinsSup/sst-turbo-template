import type { components } from "@template/api-types";

type ToErrorFormat = components["schemas"]["ErrorResponseDto"] & {
  error:
    | components["schemas"]["ValidationExceptionResponseDto"]
    | components["schemas"]["HttpExceptionResponseDto"];
};

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

type ToValidationErrorFormat = components["schemas"]["ErrorResponseDto"] & {
  error:
    | components["schemas"]["ValidationExceptionResponseDto"]
    | components["schemas"]["HttpExceptionResponseDto"];
};

/**
 * @description server side open-api error format with react-hook-form error format
 * @param {ToValidationErrorFormat} error
 * @returns {ReturnErrorFormat}
 */
export function toValidationErrorFormat(
  error: ToValidationErrorFormat,
): ReturnErrorFormat {
  const {
    error: { validationErrorInfo },
  } = error;
  return Object.fromEntries(
    Object.entries(validationErrorInfo).map(([key, value]) => [
      key,
      {
        message: value,
      },
    ]),
  );
}
