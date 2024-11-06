import type { JWTPayload } from "jose";
import { decodeJwt } from "jose";

/**
 * @description Decode a JWT token
 * @param {string} token - JWT token
 * @returns {PayloadType | null} Decoded JWT token payload
 */
export const jwtDecode = <PayloadType = JWTPayload>(
  token: string,
): PayloadType | null => {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
};
