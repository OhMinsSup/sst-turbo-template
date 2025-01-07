import type { AuthErrorCode } from "../constants";
import { BaseError } from "./baseError";

export class AuthError extends BaseError {
  /**
   * Error code associated with the error. Most errors coming from
   * HTTP responses will have a code, though some errors that occur
   * before a response is received will not have one present. In that
   * case {@link #status} will also be undefined.
   */
  errorCode?: AuthErrorCode;

  /** HTTP status code that caused the error. */
  statusCode?: number;

  static __auth_error__ = true;

  constructor(
    message: string,
    opts: {
      cause?: unknown;
    } = {},
  ) {
    super(message, opts);
  }

  toJSON(): Pick<AuthError, "message" | "statusCode" | "errorCode" | "data"> {
    const obj: Pick<
      AuthError,
      "message" | "statusCode" | "errorCode" | "data"
    > = {
      message: this.message,
    };

    if (this.errorCode != undefined) {
      obj.errorCode = this.errorCode;
    }

    if (this.statusCode != undefined) {
      obj.statusCode = this.statusCode;
    }

    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }
}

export function createAuthError(
  input:
    | string
    | (Partial<AuthError> & {
        errorCode?: AuthErrorCode | string;
        statusCode?: number;
      }),
) {
  if (typeof input === "string") {
    return new AuthError(input);
  }

  if (isAuthError(input)) {
    return input;
  }

  const err = new AuthError(input.message ?? "AuthError", {
    cause: input.cause || input,
  });

  if ("stack" in input) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        },
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
        // Ignore
      }
    }
  }

  if (input.errorCode) {
    err.errorCode = input.errorCode;
  }

  if (input.statusCode) {
    err.statusCode = input.statusCode;
  }

  if (input.data) {
    err.data = input.data;
  }

  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }

  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }

  return err;
}

export function isAuthError(input: any): input is AuthError {
  return input?.constructor?.__auth_error__ === true;
}
