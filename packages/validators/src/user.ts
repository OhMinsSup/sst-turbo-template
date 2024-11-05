import * as z from "zod";

import { idSchema } from "./shared";

export const ByUserIdSchema = z.object({}).merge(idSchema);

export const schema = {
  byUserId: ByUserIdSchema,
};

export type FormFieldByUserIdSchema = z.infer<typeof schema.byUserId>;
