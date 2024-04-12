export interface NormalizedOptions {
  formatStr?: string;
  dateValue?: Date | number | string | null;
  errorType?:
    | 'string'
    | 'number'
    | 'instance'
    | 'invalid'
    | 'null'
    | 'undefined'
    | 'unknown';
}

export class DateError extends Error {
  public options: NormalizedOptions;

  constructor(message: string, options: NormalizedOptions) {
    super(message);

    this.name = 'DateError';
    this.options = options;
  }

  public static isDateError(value: unknown): value is DateError {
    return value instanceof DateError;
  }
}
