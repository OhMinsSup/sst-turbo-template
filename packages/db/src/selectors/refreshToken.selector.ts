import { Prisma } from "@prisma/client";

export const getBaseRefreshTokenSelector = () => {
  return Prisma.validator<Prisma.RefreshTokenSelect>()({
    id: true,
    token: true,
    parent: true,
    revoked: true,
    userId: true,
    sessionId: true,
  });
};

export const getRefreshTokenSelector = () => {
  return Prisma.validator<Prisma.RefreshTokenSelect>()({
    ...getBaseRefreshTokenSelector(),
  });
};

export type RefreshTokenPayload = Prisma.RefreshTokenGetPayload<{
  select: ReturnType<typeof getRefreshTokenSelector>;
}>;
