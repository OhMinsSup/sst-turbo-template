import * as z from "zod";

import { paginationSchema } from "./shared.schema";

export const getInfiniteSchema = z
  .object({
    keyword: z.string().optional(),
  })
  .merge(paginationSchema);

export const createPostSchema = z.object({
  text: z.string().min(3, "본문은 최소 3자 이상이어야 합니다."),
});

export const schema = {
  getInfinitePost: getInfiniteSchema,
  createPost: createPostSchema,
};

export type QueryGetInfinitePostSchema = z.infer<typeof schema.getInfinitePost>;

export type FormFieldCreatePostSchema = z.infer<typeof schema.createPost>;
