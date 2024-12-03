import type { SupportedStorage } from "../types";

/**
 * @description 메모리에 키-값 쌍을 저장하는 localStorage와 유사한 객체
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
