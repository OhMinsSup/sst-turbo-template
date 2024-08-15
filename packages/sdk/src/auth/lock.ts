export async function lockNoOp<R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>,
): Promise<R> {
  return await fn();
}

/**
 * An error thrown when a lock cannot be acquired after some amount of time.
 *
 * Use the {@link #isAcquireTimeout} property instead of checking with `instanceof`.
 */
export abstract class LockAcquireTimeoutError extends Error {
  public readonly isAcquireTimeout = true;

  constructor(message: string) {
    super(message);
  }
}

export class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {}

export async function navigatorLock<R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>,
): Promise<R> {
  const abortController = new AbortController();

  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
    }, acquireTimeout);
  }

  // MDN article: https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request
  const options: LockOptions =
    acquireTimeout === 0
      ? {
          mode: "exclusive",
          ifAvailable: true,
        }
      : {
          mode: "exclusive",
          signal: abortController.signal,
        };

  const callback: LockGrantedCallback = async (lock) => {
    if (lock) {
      try {
        return await fn();
      } finally {
        // empty
      }
    } else {
      if (acquireTimeout === 0) {
        throw new NavigatorLockAcquireTimeoutError(
          `Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`,
        );
      } else {
        // Browser is not following the Navigator LockManager spec, it
        // returned a null lock when we didn't use ifAvailable. So we can
        // pretend the lock is acquired in the name of backward compatibility
        // and user experience and just run the function.
        return await fn();
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return await navigator.locks.request(name, options, callback);
}
