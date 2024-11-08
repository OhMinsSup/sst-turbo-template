/**
 * @description Lock(잠금)은 비동기 함수가 동시에 실행되지 않도록 하는 동기화 메커니즘입니다.
 * @param {string} name
 * @param {number} acquireTimeout
 * @param {() => Promise<R>} fn
 * @param {boolean} lockDebugMessages
 * @returns {Promise<R>}
 */
export async function lockNoOp<R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lockDebugMessages = false,
): Promise<R> {
  return await fn();
}

export abstract class LockAcquireTimeoutError extends Error {
  public readonly isAcquireTimeout = true;

  constructor(message: string) {
    super(message);
  }
}

export class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {}

/**
 * @description Navigator LockManager API를 사용하여 잠금을 획득하고 해제합니다.
 * @param {string} name
 * @param {number} acquireTimeout
 * @param {() => Promise<R>} fn
 * @param {boolean} lockDebugMessages
 * @returns {Promise<R>}
 */
export async function navigatorLock<R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>,

  lockDebugMessages = false,
): Promise<R> {
  const abortController = new AbortController();

  // acquireTimeout이 0보다 큰 경우: acquireTimeout 밀리초 후에 잠금을 취소합니다.
  // acquireTimeout이 0인 경우: 잠금을 즉시 획득하려고 시도합니다.
  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
      if (lockDebugMessages) {
        console.log(
          `Aborted acquiring Navigator LockManager lock "${name}" after ${acquireTimeout}ms`,
        );
      }
    }, acquireTimeout);
  }

  // MDN article: https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request
  // acquireTimeout이 0인 경우:
  // mode를 "exclusive"로 설정하고, ifAvailable을 true로 설정합니다. 이는 잠금을 즉시 획득할 수 있는 경우에만 잠금을 시도합니다.
  // acquireTimeout이 0이 아닌 경우:
  // mode를 "exclusive"로 설정하고, signal을 abortController.signal로 설정합니다. 이는 잠금을 시도하는 동안 취소 신호를 받을 수 있도록 합니다.
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
      if (lockDebugMessages) {
        console.log(`Acquired Navigator LockManager lock "${name}"`);
      }
      try {
        return await fn();
      } finally {
        if (lockDebugMessages) {
          console.log(`Released Navigator LockManager lock "${name}"`);
        }
      }
    } else {
      if (acquireTimeout === 0) {
        throw new NavigatorLockAcquireTimeoutError(
          `Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`,
        );
      } else {
        // 브라우저가 Navigator LockManager 사양을 따르지 않는 경우를 처리합니다.
        // 이 경우 잠금이 획득된 것처럼 fn 함수를 실행하고 그 결과를 반환합니다.
        return await fn();
      }
    }
  };

  return (await navigator.locks.request(name, options, callback)) as Promise<R>;
}
