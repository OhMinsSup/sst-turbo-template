import type { SupportedStorage } from "../types";
import { isSupportsLocalStorage } from "../utils/helper";

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
