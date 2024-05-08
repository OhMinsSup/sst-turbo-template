import { Prisma } from '@prisma/client';

export const getWalletSelector = () => {
  return Prisma.validator<Prisma.WalletSelect>()({
    address: true,
    label: true,
    connectedAt: true,
    createdAt: true,
  });
};
