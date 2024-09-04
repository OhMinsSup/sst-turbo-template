/**
 * A deferred represents some asynchronous work that is not yet finished, which
 * may or may not culminate in a value.
 * Taken from: https://github.com/mike-north/types/blob/master/src/async.ts
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
