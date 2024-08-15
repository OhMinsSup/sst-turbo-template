import type { SupportedStorage } from "./types";

// Storage helpers
export const setItemAsync = async (
  storage: SupportedStorage,
  key: string,
  data: unknown,
): Promise<void> => {
  await storage.setItem(key, JSON.stringify(data));
};

export const getItemAsync = async (
  storage: SupportedStorage,
  key: string,
): Promise<unknown> => {
  const value: Awaited<string | null> = await storage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const removeItemAsync = async (
  storage: SupportedStorage,
  key: string,
): Promise<void> => {
  await storage.removeItem(key);
};

export function canUseDOM(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-optional-chain
      window.document &&
      // eslint-disable-next-line @typescript-eslint/unbound-method
      window.document.createElement,
  );
}

export const isBrowser = () => canUseDOM();

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isTrusted = (value: unknown): value is boolean =>
  isBoolean(value) && value;

export const isSupportedNavigatorLocks = () => isBrowser() && navigator.locks;

/**
 * Checks whether localStorage is supported on this browser.
 */
export const isSupportsLocalStorage = () => {
  if (!isBrowser()) {
    return false;
  }

  try {
    if (typeof localStorage !== "object") {
      return false;
    }
  } catch {
    // DOM exception when accessing `localStorage`
    return false;
  }

  const randomKey = `lswt-${Math.random()}${Math.random()}`;

  try {
    localStorage.setItem(randomKey, randomKey);
    localStorage.removeItem(randomKey);

    return true;
  } catch {
    // localStorage can't be written to
    // https://www.chromium.org/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document
    return false;
  }
};

/**
 * A deferred represents some asynchronous work that is not yet finished, which
 * may or may not culminate in a value.
 * Taken from: https://github.com/mike-north/types/blob/master/src/async.ts
 */
export class Deferred<T = any> {
  public static promiseConstructor: PromiseConstructor = Promise;

  public readonly promise: PromiseLike<T>;

  // @ts-expect-error -- TS doesn't know that resolve and reject will be set later
  public readonly resolve: (value?: T | PromiseLike<T>) => void;

  // @ts-expect-error -- TS doesn't know that resolve and reject will be set later
  public readonly reject: (reason?: any) => any;

  public constructor() {
    this.promise = new Deferred.promiseConstructor((res, rej) => {
      // @ts-expect-error  -- TS doesn't know that resolve and reject will be set later
      this.resolve = res;
      // @ts-expect-error  -- TS doesn't know that resolve and reject will be set later
      this.reject = rej;
    });
  }
}
