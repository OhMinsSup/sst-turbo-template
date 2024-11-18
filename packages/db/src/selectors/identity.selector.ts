import { Prisma } from "@prisma/client";

export const getBaseIdentitySelector = () => {
  return Prisma.validator<Prisma.IdentitySelect>()({
    id: true,
    userId: true,
    providerId: true,
    provider: true,
    email: true,
    identityData: true,
    lastSignInAt: true,
  });
};

export const getIdentitySelector = () => {
  return Prisma.validator<Prisma.IdentitySelect>()({
    ...getBaseIdentitySelector(),
  });
};

export const getIdentityWithoutUserIdSelector = () => {
  return Prisma.validator<Prisma.IdentitySelect>()({
    id: true,
    providerId: true,
    provider: true,
    email: true,
    identityData: true,
    lastSignInAt: true,
  });
};

export type IdentityPayload = Prisma.IdentityGetPayload<{
  select: ReturnType<typeof getIdentitySelector>;
}>;

export type IdentityWithoutUserIdPayload = Prisma.IdentityGetPayload<{
  select: ReturnType<typeof getIdentityWithoutUserIdSelector>;
}>;
