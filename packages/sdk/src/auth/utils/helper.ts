import { isBrowser } from "@template/utils/assertion";

import type { SupportedStorage } from "../types";

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

export const isSupportedBroadcastChannel = () =>
  isBrowser() && "BroadcastChannel" in globalThis;

export const isSupportedNavigatorLocks = () =>
  isBrowser() && "navigator" in globalThis && "locks" in navigator;

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

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
