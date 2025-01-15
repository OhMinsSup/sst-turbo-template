import type { AuthErrorCode } from "../constants";
import { BaseError } from "./baseError";

export class AuthError<DataT = unknown> extends BaseError {
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

  toJSON(): Pick<
    AuthError<DataT>,
    "message" | "statusCode" | "errorCode" | "data"
  > {
    const obj: Pick<
      AuthError<DataT>,
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

export function createAuthError<DataT = unknown>(
  input:
    | string
    | (Partial<AuthError<DataT>> & {
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        errorCode?: AuthErrorCode | string;
        statusCode?: number;
      }),
) {
  if (typeof input === "string") {
    return new AuthError<DataT>(input);
  }

  if (isAuthError<DataT>(input)) {
    return input;
  }

  const err = new AuthError<DataT>(input.message ?? "AuthError", {
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

export function isAuthError<DataT = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any,
): input is AuthError<DataT> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return input?.constructor?.__auth_error__ === true;
}
