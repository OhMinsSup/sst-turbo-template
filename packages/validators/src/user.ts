import * as z from "zod";

export const updateUsernameSchema = z.object({
  username: z.string().max(50, "이름은 50글자 이하여야 합니다.").optional(),
});

export const updateUserImageSchema = z.object({
  image: z.string().url().optional(),
});

export const schema = {
  updateUsername: updateUsernameSchema,
  updateUserImage: updateUserImageSchema,
};

export type FormFieldUpdateUsername = z.infer<typeof schema.updateUsername>;

export type FormFieldUpdateUserImage = z.infer<typeof schema.updateUserImage>;
