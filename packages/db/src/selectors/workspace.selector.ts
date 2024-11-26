import { Prisma } from "@prisma/client";

export const getBaseWorkspaceSelector = () => {
  return Prisma.validator<Prisma.WorkSpaceSelect>()({
    id: true,
    title: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  });
};

export const getWorkspaceSelector = () => {
  return Prisma.validator<Prisma.WorkSpaceSelect>()({
    ...getBaseWorkspaceSelector(),
  });
};

export type WorkspacePayload = Prisma.WorkSpaceGetPayload<{
  select: ReturnType<typeof getWorkspaceSelector>;
}>;
