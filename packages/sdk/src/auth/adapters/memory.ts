import type { SupportedStorage } from "../types";

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
