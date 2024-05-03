import { Prisma } from '@prisma/client';

export const getPasswordSelector = () =>
  Prisma.validator<Prisma.PasswordSelect>()({
    hash: true,
  });

export const getWalletSelector = () =>
  Prisma.validator<Prisma.WalletSelect>()({
    address: true,
    connectedAt: true,
  });

export const getUserImageSelector = () =>
  Prisma.validator<Prisma.UserImageSelect>()({
    blob: true,
    contentType: true,
    altText: true,
  });

export const getPermissionsSelector = () =>
  Prisma.validator<Prisma.PermissionSelect>()({
    action: true,
    entity: true,
    access: true,
    description: true,
  });

export const getRolesSelector = () =>
  Prisma.validator<Prisma.RoleSelect>()({
    name: true,
    description: true,
  });

export const getBaseUserSelector = () =>
  Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true,
    username: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  });

export const getBaseUserFullSelector = () =>
  Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
    nonce: true,
  });

export const getUserFullSelector = () =>
  Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserFullSelector(),
    image: {
      select: getUserImageSelector(),
    },
    password: {
      select: getPasswordSelector(),
    },
    wallets: {
      select: getWalletSelector(),
    },
    roles: {
      select: getRolesSelector(),
    },
  });

export const getUserExternalFullSelector = () =>
  Prisma.validator<Prisma.UserSelect>()({
    ...getBaseUserSelector(),
    image: {
      select: getUserImageSelector(),
    },
    wallets: {
      select: getWalletSelector(),
    },
    roles: {
      select: getRolesSelector(),
    },
  });
