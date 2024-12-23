import { Prisma } from "@prisma/client";

export const getBaseTableSelector = () => {
  return Prisma.validator<Prisma.TableSelect>()({
    id: true,
    name: true,
    description: true,
    dbTableName: true,
    version: true,
    order: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  });
};

export const getTableSelector = () => {
  return Prisma.validator<Prisma.TableSelect>()({
    ...getBaseTableSelector(),
  });
};

export type TablePayload = Prisma.TableGetPayload<{
  select: ReturnType<typeof getTableSelector>;
}>;
