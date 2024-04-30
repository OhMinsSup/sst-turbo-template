import { type User } from '@prisma/client';

export class Authorization {
  accessToken: string;
  refreshToken: string;
}

export interface BaseJwtPayload {
  /** Issued at */
  iat: number;
  /** Expiration time */
  exp: number;
}

export interface UserPayload {
  type: 'user';
  id: User['id'];
  email: User['email'];
  name: User['username'];
}

export type JwtPayload = UserPayload;
export type JwtDto = JwtPayload & BaseJwtPayload;
