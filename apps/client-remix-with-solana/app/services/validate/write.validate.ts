import * as z from 'zod';

export const schema = z.object({
  text: z.string().min(1).max(500),
  htmlJSON: z.string().optional(),
  hashTags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
});

export type FormFieldValues = z.infer<typeof schema>;
