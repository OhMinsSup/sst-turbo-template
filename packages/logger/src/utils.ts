import type { EnabledLogLevels, Metadata } from './types';

import { LogLevel } from './constants';

export const enabledLogLevels: EnabledLogLevels = {
  [LogLevel.Debug]: [
    LogLevel.Debug,
    LogLevel.Info,
    LogLevel.Log,
    LogLevel.Warn,
    LogLevel.Error,
  ],
  [LogLevel.Info]: [LogLevel.Info, LogLevel.Log, LogLevel.Warn, LogLevel.Error],
  [LogLevel.Log]: [LogLevel.Log, LogLevel.Warn, LogLevel.Error],
  [LogLevel.Warn]: [LogLevel.Warn, LogLevel.Error],
  [LogLevel.Error]: [LogLevel.Error],
};

export function prepareMetadata(metadata: Metadata): Metadata {
  return Object.keys(metadata).reduce((acc, key) => {
    let value = metadata[key];
    if (value instanceof Error) {
      value = value.toString();
    }
    return { ...acc, [key]: value };
  }, {});
}

export function formatDate(
  timestamp: number,
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions | undefined,
): string {
  return new Date(timestamp).toLocaleString(locales, options);
}
