import * as z from "zod";

export const paginationSchema = z.object({
  limit: z.number().optional(),
  pageNo: z.number().optional(),
});

export const idSchema = z.object({
  id: z.string(),
});
