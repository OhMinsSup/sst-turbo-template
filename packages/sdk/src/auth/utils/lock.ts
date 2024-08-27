export async function lockNoOp<R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>,
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

export async function navigatorLock<R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>,
): Promise<R> {
  const abortController = new AbortController();

  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
      console.log(
        `Aborted acquiring Navigator LockManager lock "${name}" after ${acquireTimeout}ms`,
      );
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
      console.log(`Acquired Navigator LockManager lock "${name}"`);
      try {
        return await fn();
      } finally {
        console.log(`Released Navigator LockManager lock "${name}"`);
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
