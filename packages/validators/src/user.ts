import * as z from "zod";

export const accountSchema = z.object({
  username: z.string().max(50, "이름은 50글자 이하여야 합니다."),
  email: z.string().email(),
});

export const updateUserSchema = z.object({
  image: z.string().url().optional(),
  firstName: z.string().max(20, "이름은 20글자 이하여야 합니다.").optional(),
  lastName: z.string().max(20, "성은 20글자 이하여야 합니다.").optional(),
});

/**
 * @deprecated
 */
export const updateUsernameSchema = z.object({
  username: z.string().max(50, "이름은 50글자 이하여야 합니다.").optional(),
});

/**
 * @deprecated
 */
export const updateUserImageSchema = z.object({
  image: z.string().url().optional(),
});

export const schema = {
  account: accountSchema,
  updateUser: updateUserSchema,
  /**
   * @deprecated
   */
  updateUsername: updateUsernameSchema,
  /**
   * @deprecated
   */
  updateUserImage: updateUserImageSchema,
};

export type FormFieldAccount = z.infer<typeof schema.account>;

export type FormFieldUpdateUser = z.infer<typeof schema.updateUser>;

/**
 * @deprecated
 */
export type FormFieldUpdateUsername = z.infer<typeof schema.updateUsername>;

/**
 * @deprecated
 */
export type FormFieldUpdateUserImage = z.infer<typeof schema.updateUserImage>;
