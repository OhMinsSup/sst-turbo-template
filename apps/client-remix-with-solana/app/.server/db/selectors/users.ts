import { Prisma } from '@prisma/client';

import { getWalletSelector } from './wallets';

export const getUserSimpleSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
  });
};

export const getUserProfileSelector = () => {
  return Prisma.validator<Prisma.UserProfileSelect>()({
    bio: true,
    website: true,
  });
};

export const getUserPasswordSelector = () => {
  return Prisma.validator<Prisma.UserPasswordSelect>()({
    hash: true,
  });
};

export const getUserImageSelector = () => {
  return Prisma.validator<Prisma.UserImageSelect>()({
    altText: true,
    contentType: true,
    blob: true,
  });
};

export const getRoleSelector = () => {
  return Prisma.validator<Prisma.RoleSelect>()({
    id: true,
    role: true,
  });
};

export const getSessionSelector = () => {
  return Prisma.validator<Prisma.SessionSelect>()({
    id: true,
    expirationDate: true,
    createdAt: true,
  });
};

export const getBaseUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true,
    name: true,
    username: true,
    emailVerifiedAt: true,
    createdAt: true,
  });
};

export const getUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
    profile: {
      select: getUserProfileSelector(),
    },
    image: {
      select: getUserImageSelector(),
    },
    roles: {
      select: getRoleSelector(),
    },
  });
};

export const getUserInternalSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    ...getUserSelector(),
    nonce: true,
    deletedAt: true,
    lastActiveAt: true,
    lastLoginAt: true,
    wallets: {
      select: getWalletSelector(),
    },
    password: {
      select: getUserPasswordSelector(),
    },
  });
};
