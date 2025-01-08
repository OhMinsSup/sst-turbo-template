import type { JWTPayload } from "jose";
import { decodeJwt } from "jose";

type DecodedJWT<Data = Record<string, unknown>> = JWTPayload & Data;

/**
 * @description Decode a JWT token
 * @param {string} token - JWT token
 * @returns {DecodedJWT<Data> | null} Decoded JWT token
 */
export const jwtDecode = <Data extends Record<string, unknown>>(
  token: string,
): DecodedJWT<Data> | null => {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
};
