import { format, type FormatOptions } from 'date-fns/format';
import { BaseError, ErrorType } from '@template/error';

export const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

export function formatDate(
  date: Date | number | string,
  formatStr = defaultFormat,
  opts?: FormatOptions,
): string {
  if (typeof date === 'string') {
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
      throw new BaseError(ErrorType.DateError, `Invalid date string: ${date}`);
    }
    date = newDate;
  }

  if (typeof date === 'number') {
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
      throw new BaseError(ErrorType.DateError, `Invalid date number: ${date}`);
    }
    date = newDate;
  }

  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      throw new BaseError(ErrorType.DateError, 'Invalid date instance');
    }
  }

  return format(date, formatStr, opts);
}
