import { Prisma } from "@prisma/client";

import { getIdentitySelector } from "./identity.selector";
import { getRefreshTokenSelector } from "./refreshToken.selector";
import { getOnlySymbolRoleSelector } from "./role.selector";
import { getSessionSelector } from "./session.selector";

export const getBaseUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true,
    username: true,
    emailConfirmedAt: true,
    isSuspended: true,
    deletedAt: true,
  });
};

export const getUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
    Role: {
      select: getOnlySymbolRoleSelector(),
    },
  });
};

export const getExternalUserSelector = () => getUserSelector();

export const getInternalUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    ...getExternalUserSelector(),
    encryptedPassword: true,
    encryptedSalt: true,
    lastActiveAt: true,
    lastSignInAt: true,
    Identity: {
      select: getIdentitySelector(),
    },
    Session: {
      select: getSessionSelector(),
    },
    RefreshToken: {
      select: getRefreshTokenSelector(),
    },
  });
};

export type UserPayload = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserSelector>;
}>;

export type UserInternalPayload = Prisma.UserGetPayload<{
  select: ReturnType<typeof getInternalUserSelector>;
}>;

export type UserExternalPayload = Prisma.UserGetPayload<{
  select: ReturnType<typeof getExternalUserSelector>;
}>;
