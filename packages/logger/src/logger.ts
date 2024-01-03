import { LogLevel } from './constants';
import type { LoggerConstructorOptions, Metadata, Transport } from './types';
import { enabledLogLevels } from './utils';
import { add } from './transport/entries';

let id = 1;
const generateUniqueId = () => {
  const prefixRandomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  return `${Date.now()}:${prefixRandomUUID()}:${id++}`;
};

export class Logger {
  LogLevel = LogLevel;

  enabled: boolean;
  level: LogLevel;
  transports: Transport[] = [];

  protected debugContextRegexes: RegExp[] = [];

  constructor({
    enabled = true,
    level = LogLevel.Info,
    debug = '',
  }: LoggerConstructorOptions = {}) {
    this.enabled = enabled;
    this.level = debug ? LogLevel.Debug : level ?? LogLevel.Info; // default to info
    this.debugContextRegexes = (debug || '').split(',').map((context) => {
      return new RegExp(context.replace(/[^\w:*]/, '').replace(/\*/g, '.*'));
    });
  }

  debug(message: string, metadata: Metadata = {}, context?: string) {
    if (context && !this.debugContextRegexes.find((reg) => reg.test(context)))
      return;
    this.transport(LogLevel.Debug, message, metadata);
  }

  info(message: string, metadata: Metadata = {}) {
    this.transport(LogLevel.Info, message, metadata);
  }

  log(message: string, metadata: Metadata = {}) {
    this.transport(LogLevel.Log, message, metadata);
  }

  warn(message: string, metadata: Metadata = {}) {
    this.transport(LogLevel.Warn, message, metadata);
  }

  error(error: Error | string, metadata: Metadata = {}) {
    this.transport(LogLevel.Error, error, metadata);
  }

  addTransport(transport: Transport) {
    this.transports.push(transport);
    return () => {
      this.transports.splice(this.transports.indexOf(transport), 1);
    };
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  protected transport(
    level: LogLevel,
    message: string | Error,
    metadata: Metadata = {},
  ) {
    if (!this.enabled) return;

    const timestamp = Date.now();
    const meta = metadata || {};

    add({
      id: generateUniqueId(),
      timestamp,
      level,
      message,
      metadata: meta,
    });

    if (!enabledLogLevels[this.level].includes(level)) return;

    for (const transport of this.transports) {
      transport(level, message, meta, timestamp);
    }
  }
}
