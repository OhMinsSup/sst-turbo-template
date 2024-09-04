import { FetchError } from "ofetch";

export {
  AppError,
  isError as isAppError,
  createError as createAppError,
} from "./app";
export {
  HttpError,
  isError as isHttpError,
  createError as createHttpError,
} from "./http";
export { FetchError };
export const isFetchError = <T = any>(input: unknown): input is FetchError<T> =>
  input instanceof FetchError;
