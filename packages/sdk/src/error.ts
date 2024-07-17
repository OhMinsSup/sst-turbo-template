import { FetchError } from "ofetch";

export {
  AppError,
  isError as isAppError,
  createError as createAppError,
} from "./errors";
export {
  HttpError,
  isError as isHttpError,
  createError as createHttpError,
} from "./errors/http";
export { FetchError };
export const isFetchError = (input: unknown): input is FetchError =>
  input instanceof FetchError;
