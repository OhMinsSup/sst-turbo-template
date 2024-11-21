import { randomUUID } from "uncrypto";

import { isBrowser } from "@template/utils/assertion";
import { toDate } from "@template/utils/date";

import type { SupportedStorage } from "../types";

/**
 * @description 스토리지에 데이터를 저장합니다.
 * @param {SupportedStorage} storage
 * @param {string} key
 * @param {unknown} data
 * @returns {Promise<void>}
 */
export const setItemAsync = async (
  storage: SupportedStorage,
  key: string,
  data: unknown,
): Promise<void> => {
  await storage.setItem(key, JSON.stringify(data));
};

/**
 * @description 스토리지에서 데이터를 가져옵니다.
 * @param {SupportedStorage} storage
 * @param {string} key
 * @returns {Promise<unknown>}
 * */
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

/**
 * @description 스토리지에서 데이터를 제거합니다.
 * @param {SupportedStorage} storage
 * @param {string} key
 * @returns {Promise<void>}
 */
export const removeItemAsync = async (
  storage: SupportedStorage,
  key: string,
): Promise<void> => {
  await storage.removeItem(key);
};

/**
 * @description BroadcastChannel 지원 여부를 확인합니다.
 * @returns {boolean}
 */
export const isSupportedBroadcastChannel = (): boolean =>
  isBrowser() && "BroadcastChannel" in globalThis;

/**
 * @description navigator.locks 지원 여부를 확인합니다.
 * @returns {boolean}
 * */
export const isSupportedNavigatorLocks = (): boolean =>
  isBrowser() && "navigator" in globalThis && "locks" in navigator;

/**
 * @description window.addEventListner 지원 여부를 확인합니다.
 * @returns {boolean}
 */
export const isSupportedWindowAddEventListener = (): boolean =>
  isBrowser() && "addEventListener" in globalThis;

/**
 * @description localStorage 지원 여부를 확인합니다.
 * @returns {boolean}
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
 * @description "uncrypto" 라이브러리를 사용하여 UUID를 생성합니다.
 * @returns {string}
 */
export function uuid(): string {
  return randomUUID();
}

/**
 * @description "expires_in" 값을 number로 변환합니다.
 * @param {string} expiresIn
 * @returns
 */
export function getExpiresIn(expiresIn: string): number {
  return parseInt(expiresIn, 10);
}

/**
 * #@description "expires_at" 값을 timestamp로 변환합니다.
 * @param {string} expiresAt
 * @returns
 */
export function getExpiresAt(expiresAt: string): number {
  return toDate(expiresAt).getTime();
}
