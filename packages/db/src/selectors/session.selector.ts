import { Prisma } from "@prisma/client";

export const getBaseSessionSelector = () => {
  return Prisma.validator<Prisma.SessionSelect>()({
    id: true,
    userId: true,
    refreshedAt: true,
    notAfter: true,
    userAgent: true,
    ip: true,
  });
};

export const getSessionSelector = () => {
  return Prisma.validator<Prisma.SessionSelect>()({
    ...getBaseSessionSelector(),
  });
};

export const getSessionWithoutUserIdSelector = () => {
  return Prisma.validator<Prisma.SessionSelect>()({
    id: true,
    refreshedAt: true,
    notAfter: true,
    userAgent: true,
    ip: true,
  });
};

export type SessionPayload = Prisma.SessionGetPayload<{
  select: ReturnType<typeof getSessionSelector>;
}>;

export type SessionWithoutUserIdPayload = Prisma.SessionGetPayload<{
  select: ReturnType<typeof getSessionWithoutUserIdSelector>;
}>;
