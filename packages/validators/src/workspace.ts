import * as z from "zod";

export const createWorkspaceSchema = z.object({
  title: z
    .string()
    .min(1, "워크스페이스 이름은 1자 이상이어야 합니다.")
    .max(30, "워크스페이스 이름은 30자 이하여야 합니다."),
  description: z
    .string()
    .max(100, "설명은 100글자 이하여야 합니다.")
    .optional(),
});

export const schema = {
  createWorkspace: createWorkspaceSchema,
};

export type FormFieldCreateWorkspace = z.infer<typeof schema.createWorkspace>;
