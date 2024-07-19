import { decodeJwt } from "jose";

export const jwtDecode = (token: string) => {
  try {
    return decodeJwt(token);
  } catch (error) {
    return null;
  }
};
