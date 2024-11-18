import { createHash, randomBytes } from "crypto";

/**
 * @description 보안성이 좋은 랜덤 토큰을 생성합니다.
 * @returns {string} 랜덤 토큰
 */
export const generateSecureToken = (): string => {
  return randomBytes(32).toString("hex"); // 32 바이트의 랜덤 값을 16진수 문자열로 변환
};

/**
 * @description 해시 값을 생성합니다.
 * @param {string} value
 * @returns {string} 해시 값
 */
export const hash = (value: string): string => {
  return createHash("sha512").update(value).digest("base64");
};
