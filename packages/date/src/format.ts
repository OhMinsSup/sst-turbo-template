import type { FormatOptions } from 'date-fns/format';
import { format } from 'date-fns/format';

import { BaseError, ErrorType } from '@template/error';

export const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

export function formatDate(
  date: Date | number | string,
  formatStr = defaultFormat,
  opts?: FormatOptions,
): string {
  let reassignDate = date;
  if (typeof reassignDate === 'string') {
    const newDate = new Date(reassignDate);
    if (isNaN(newDate.getTime())) {
      throw new BaseError(
        ErrorType.DateError,
        `Invalid date string: ${reassignDate}`,
      );
    }
    reassignDate = newDate;
  }

  if (typeof reassignDate === 'number') {
    const newDate = new Date(reassignDate);
    if (isNaN(newDate.getTime())) {
      throw new BaseError(
        ErrorType.DateError,
        `Invalid date number: ${reassignDate}`,
      );
    }
    reassignDate = newDate;
  }

  if (reassignDate instanceof Date) {
    if (isNaN(reassignDate.getTime())) {
      throw new BaseError(ErrorType.DateError, 'Invalid date instance');
    }
  }

  return format(reassignDate, formatStr, opts);
}
