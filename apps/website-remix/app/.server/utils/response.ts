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
