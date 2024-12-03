export class BaseError<DataT = unknown> extends Error {
  static __base_error__ = true;
  fatal = false;
  unhandled = false;
  data?: DataT;
  cause?: unknown;

  constructor(message: string, opts: { cause?: unknown } = {}) {
    // @ts-nocheck - https://v8.dev/features/error-cause
    super(message, opts);

    // Polyfill cause for other runtimes
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }

  toJSON() {
    const obj: Pick<BaseError<DataT>, "message" | "data"> = {
      message: this.message,
    };

    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }
}

export function createBaseError<DataT = unknown>(
  input: string | Partial<BaseError<DataT>>,
) {
  if (typeof input === "string") {
    return new BaseError<DataT>(input);
  }

  if (isBaseError<DataT>(input)) {
    return input;
  }

  const err = new BaseError<DataT>(input.message ?? "", {
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

  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }

  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }

  return err;
}

export function isBaseError<DataT = unknown>(
  input: any,
): input is BaseError<DataT> {
  return input?.constructor?.__base_error__ === true;
}
