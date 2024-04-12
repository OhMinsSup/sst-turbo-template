import type { Transport } from '../_internal/types';
import { LogLevel } from '../_internal/constants';
import { prepareMetadata } from '../_internal/utils';

export const sentryTransport =
  (Sentry: any): Transport =>
  (level, message, { type, tags, ...metadata }, timestamp) => {
    const meta = prepareMetadata(metadata);

    /**
     * If a string, report a breadcrumb
     */
    if (typeof message === 'string') {
      const severity = (
        {
          [LogLevel.Debug]: 'debug',
          [LogLevel.Info]: 'info',
          [LogLevel.Log]: 'log', // Sentry value here is undefined
          [LogLevel.Warn]: 'warning',
          [LogLevel.Error]: 'error',
        } as const
      )[level];

      Sentry.addBreadcrumb({
        message,
        data: meta,
        type: type || 'default',
        level: severity,
        timestamp: timestamp / 1000, // Sentry expects seconds
      });

      /**
       * Send all higher levels with `captureMessage`, with appropriate severity
       * level
       */
      if (
        level === LogLevel.Error ||
        level === LogLevel.Warn ||
        level === LogLevel.Log
      ) {
        const messageLevel =
          {
            [LogLevel.Log]: 'log',
            [LogLevel.Warn]: 'warning',
            [LogLevel.Error]: 'error',
          }[level] || 'log';

        // Defer non-critical messages so they're sent in a batch
        queueMessageForSentry(Sentry, message, {
          level: messageLevel,
          tags,
          extra: meta,
        });
      }
    } else {
      /**
       * It's otherwise an Error and should be reported with captureException
       */

      Sentry.captureException(message, {
        tags,
        extra: meta,
      });
    }
  };

const queuedMessages: [string, any][] = [];
let sentrySendTimeout: ReturnType<typeof setTimeout> | null = null;
function queueMessageForSentry(
  Sentry: any,
  message: string,
  captureContext: any,
) {
  queuedMessages.push([message, captureContext]);
  if (!sentrySendTimeout) {
    // Throttle sending messages with a leading delay
    // so that we can get Sentry out of the critical path.
    sentrySendTimeout = setTimeout(() => {
      sentrySendTimeout = null;
      sendQueuedMessages(Sentry);
    }, 7000);
  }
}
function sendQueuedMessages(Sentry: any) {
  while (queuedMessages.length > 0) {
    const record = queuedMessages.shift();
    if (record) {
      Sentry.captureMessage(record[0], record[1]);
    }
  }
}
