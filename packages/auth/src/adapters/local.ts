import type { SupportedStorage } from "../types";
import { isSupportsLocalStorage } from "../utils/helper";

/**
 * @description globalThis.localStorage 속성에 안전하게 액세스
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
