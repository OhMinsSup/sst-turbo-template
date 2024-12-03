import { Prisma } from "@prisma/client";

export const getBaseRoleSelector = () => {
  return Prisma.validator<Prisma.RoleSelect>()({
    id: true,
    name: true,
    symbol: true,
    description: true,
  });
};

export const getRoleSelector = () => {
  return Prisma.validator<Prisma.RoleSelect>()({
    ...getBaseRoleSelector(),
  });
};

export const getOnlySymbolRoleSelector = () => {
  return Prisma.validator<Prisma.RoleSelect>()({
    symbol: true,
  });
};

export type RolePayload = Prisma.RoleGetPayload<{
  select: ReturnType<typeof getRoleSelector>;
}>;

export type OnlySymbolRolePayload = Prisma.RoleGetPayload<{
  select: ReturnType<typeof getOnlySymbolRoleSelector>;
}>;
