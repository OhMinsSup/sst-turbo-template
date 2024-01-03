import type { LogLevel } from './constants';

export type Transport = (
  level: LogLevel,
  message: string | Error,
  metadata: Metadata,
  timestamp: number,
) => void;

export type MetadataType =
  | 'default'
  | 'debug'
  | 'error'
  | 'navigation'
  | 'http'
  | 'info'
  | 'query'
  | 'transaction'
  | 'ui'
  | 'user';

export interface Metadata {
  type?: MetadataType;
  tags?: Record<
    string,
    number | string | boolean | bigint | symbol | null | undefined
  >;

  /**
   * Any additional data, passed through to Sentry as `extra` param on
   * exceptions, or the `data` param on breadcrumbs.
   */
  [key: string]: unknown;
}

export interface ConsoleTransportEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string | Error;
  metadata: Metadata;
}

export type EnabledLogLevels = {
  [key in LogLevel]: LogLevel[];
};

export interface LoggerConstructorOptions {
  enabled?: boolean;
  level?: LogLevel;
  debug?: string;
}
