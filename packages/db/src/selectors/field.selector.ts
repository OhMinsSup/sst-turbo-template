import { Prisma } from "@prisma/client";

export const getBaseFieldSelector = () => {
  return Prisma.validator<Prisma.FieldSelect>()({
    id: true,
    fieldName: true,
    fieldType: true,
    fieldDesciption: true,
    primitiveType: true,
    dbFieldName: true,
    dbFieldType: true,
    options: true,
    version: true,
    order: true,
    isMultiple: true,
    isNotNull: true,
    isUnique: true,
    isPrimary: true,
    isComputed: true,
    isLookup: true,
    isPending: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    lookupLinkedFieldId: true,
    lookupOptions: true,
  });
};

export const getFieldSelector = () => {
  return Prisma.validator<Prisma.FieldSelect>()({
    ...getBaseFieldSelector(),
  });
};

export type FieldPayload = Prisma.FieldGetPayload<{
  select: ReturnType<typeof getFieldSelector>;
}>;
