import type { FormatOptions } from 'date-fns/format';
import { format } from 'date-fns/format';

import { DateError } from './error';

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
      throw new DateError(`Invalid date string: ${reassignDate}`, {
        dateValue: reassignDate,
        errorType: 'string',
        formatStr,
      });
    }
    reassignDate = newDate;
  }

  if (typeof reassignDate === 'number') {
    const newDate = new Date(reassignDate);
    if (isNaN(newDate.getTime())) {
      throw new DateError(`Invalid date number: ${reassignDate.toString()}`, {
        dateValue: reassignDate,
        errorType: 'number',
        formatStr,
      });
    }
    reassignDate = newDate;
  }

  if (reassignDate instanceof Date) {
    if (isNaN(reassignDate.getTime())) {
      throw new DateError('Invalid date instance', {
        dateValue: reassignDate,
        errorType: 'instance',
        formatStr,
      });
    }
  }

  return format(reassignDate, formatStr, opts);
}
