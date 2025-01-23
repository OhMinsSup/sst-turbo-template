import { HttpStatusCode } from "../constants/httpStatusCode";
import { BaseError } from "./baseError";

export class HttpError<DataT = unknown> extends BaseError<DataT> {
  static __http_error__ = true;
  statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  fatal = false;
  unhandled = false;
  statusMessage?: string;

  constructor(message: string, opts: { cause?: unknown } = {}) {
    super(message, opts);
  }

  toJSON() {
    const obj: Pick<
      HttpError<DataT>,
      "message" | "statusCode" | "statusMessage" | "data"
    > = {
      message: this.message,
      statusCode: this.statusCode,
    };

    if (this.statusMessage) {
      obj.statusMessage = this.statusMessage;
    }
    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }
}

export function createHttpError<DataT = unknown>(
  input:
    | string
    | (Partial<HttpError<DataT>> & {
        status?: number;
        statusText?: string;
      }),
) {
  if (typeof input === "string") {
    return new HttpError<DataT>(input);
  }

  if (isHttpError<DataT>(input)) {
    return input;
  }

  const err = new HttpError<DataT>(input.message ?? input.statusMessage ?? "", {
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

  if (input.data) {
    err.data = input.data;
  }

  if (input.statusCode) {
    err.statusCode = input.statusCode;
  } else if (input.status) {
    err.statusCode = input.status;
  }

  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }

  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }

  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }

  return err;
}

export function isHttpError<DataT = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any,
): input is HttpError<DataT> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return input?.constructor?.__http_error__ === true;
}
