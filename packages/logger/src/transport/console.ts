import type { Transport } from '../_internal/types';
import { LogLevel } from '../_internal/constants';
import { formatDate, prepareMetadata } from '../_internal/utils';

export const consoleTransport: Transport = (
  level,
  message,
  metadata,
  timestamp,
) => {
  const extra = Object.keys(metadata).length
    ? ` ${JSON.stringify(prepareMetadata(metadata), null, '  ')}`
    : '';
  const log = {
    [LogLevel.Debug]: console.debug,
    [LogLevel.Info]: console.info,
    [LogLevel.Log]: console.log,
    [LogLevel.Warn]: console.warn,
    [LogLevel.Error]: console.error,
  }[level];

  if (message instanceof Error) {
    console.info(
      `${formatDate(timestamp, 'ko-KR', {
        timeZone: 'UTC',
      })} ${message.toString()}${extra}`,
    );
    log(message);
  } else {
    log(
      `${formatDate(timestamp, 'ko-KR', {
        timeZone: 'UTC',
      })} ${message.toString()}${extra}`,
    );
  }
};
