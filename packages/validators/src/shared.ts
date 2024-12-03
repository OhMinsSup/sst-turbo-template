import * as z from "zod";

export const paginationSchema = z.object({
  limit: z.number().nullable().optional(),
  pageNo: z.number().nullable().optional(),
});

export const idSchema = z.object({
  id: z.string().cuid(),
});

export const schema = {
  pagination: paginationSchema,
  id: idSchema,
};

export type FormFieldPaginationSchema = z.infer<typeof schema.pagination>;

export type FormFieldIdSchema = z.infer<typeof schema.id>;
