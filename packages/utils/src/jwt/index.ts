import jwt from "jsonwebtoken";

export const jwtDecode = (token: string) => {
  try {
    return jwt.decode(token, { json: true });
  } catch (error) {
    return null;
  }
};
