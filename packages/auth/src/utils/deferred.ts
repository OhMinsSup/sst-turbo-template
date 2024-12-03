/**
 * @description Deferred(지연된 것)는 아직 완료되지 않은 일부 비동기 작업을 나타내며,
 * 이는 값으로 culminate(종결)될 수도 있고 그렇지 않을 수도 있습니다.
 * @link https://github.com/mike-north/types/blob/master/src/async.ts
 */
export class Deferred<T> {
  static fromPromise<T>(p: Promise<T>): Deferred<T> {
    const d = new Deferred<T>();
    p.then(d.resolve, d.reject);
    return d;
  }

  promise: Promise<T>;
  reject!: (reason?: unknown) => void;
  resolve!: (value: T | PromiseLike<T>) => void;

  constructor() {
    this.promise = new Promise((a, b) => {
      this.resolve = a;
      this.reject = b;
    });
  }
}
