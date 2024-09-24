import { Prisma } from "@prisma/client";

import { getUserSelector } from "./users.selector";

export const getBasePostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    id: true,
    text: true,
    createdAt: true,
    updatedAt: true,
  });
};

export const getPostSelector = () => {
  return Prisma.validator<Prisma.PostSelect>()({
    ...getBasePostSelector(),
    Author: {
      select: getUserSelector(),
    },
  });
};

export type PostPayload = Prisma.PostGetPayload<{
  select: ReturnType<typeof getPostSelector>;
}>;
