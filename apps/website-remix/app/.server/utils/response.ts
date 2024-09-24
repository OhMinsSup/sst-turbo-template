import type { RequestMethod } from "@template/sdk";
import { createHttpError, ErrorDisplayType, HttpStatus } from "@template/sdk";

export const successJsonDataResponse = <D = unknown>(
  data: D,
  message?: RemixDataFlow.Message,
): RemixDataFlow.Response<D, null> => {
  return {
    status: "success" as const,
    result: data,
    message: message ?? null,
    errors: null,
  };
};

export const errorJsonDataResponse = <D = unknown>(
  data: D,
  message?: RemixDataFlow.Message,
): RemixDataFlow.Response<D, null> => {
  return {
    status: "error" as const,
    result: data,
    message: message ?? null,
    errors: null,
  };
};

export const validateRequestMethods = (
  request: Request,
  methods: RequestMethod[],
) => {
  if (!methods.includes(request.method.toUpperCase() as RequestMethod)) {
    throw createHttpError({
      statusMessage: "Method Not Allowed",
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      displayType: ErrorDisplayType.TOAST,
      data: "not allowed method",
    });
  }
};
