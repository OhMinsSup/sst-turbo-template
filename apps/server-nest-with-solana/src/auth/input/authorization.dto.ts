import { type SerializeExternalUser } from '../../serialize/serialize.interface';

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

export type JwtPayload = SerializeExternalUser;
export type JwtDto = JwtPayload & BaseJwtPayload;
