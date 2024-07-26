import { decodeJwt } from "jose";

// Decode a JWT token
export const jwtDecode = (token: string) => {
  try {
    return decodeJwt(token);
  } catch (error) {
    return null;
  }
};
