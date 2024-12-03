import { Prisma } from "@prisma/client";

export const getBaseDatabaseSelector = () => {
  return Prisma.validator<Prisma.DatabaseSelect>()({
    id: true,
    title: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  });
};

export const getDatabaseSelector = () => {
  return Prisma.validator<Prisma.DatabaseSelect>()({
    ...getBaseDatabaseSelector(),
  });
};

export type DatabasePayload = Prisma.DatabaseGetPayload<{
  select: ReturnType<typeof getDatabaseSelector>;
}>;
