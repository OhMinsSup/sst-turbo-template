import * as z from "zod";

import { idSchema } from "./shared.schema";

export const ByUserIdSchema = z.object({}).merge(idSchema);

export const schema = {
  byUserId: ByUserIdSchema,
};

export type ParamsByUserIdSchema = z.infer<typeof schema.byUserId>;
