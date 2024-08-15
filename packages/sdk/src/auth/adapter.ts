import type { SupportedStorage } from "./types";
import { isSupportsLocalStorage } from "./helper";

/**
 * Returns a localStorage-like object that stores the key-value pairs in
 * memory.
 */
export function memoryLocalStorageAdapter(
  store: Record<string, string> = {},
): SupportedStorage {
  return {
    getItem: (key: string) => {
      return store[key] ?? null;
    },
    setItem: (key: string, value: string) => {
      store = { ...store, [key]: value };
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
}

/**
 * Provides safe access to the globalThis.localStorage property.
 */
export const localStorageAdapter: SupportedStorage = {
  getItem: (key) => {
    if (!isSupportsLocalStorage()) {
      return null;
    }

    return localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (!isSupportsLocalStorage()) {
      return;
    }

    localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (!isSupportsLocalStorage()) {
      return;
    }

    localStorage.removeItem(key);
  },
};
