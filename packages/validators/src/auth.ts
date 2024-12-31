import * as z from "zod";

import { Provider } from "@template/common";

export const signInSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(6, "비밀번호는 6글자 이상이어야 합니다.")
    .max(100, "비밀번호는 100글자 이하여야 합니다."),
  provider: z
    .enum([Provider.EMAIL, Provider.PASSWORD], {
      message: "잘못된 인증 방식입니다.",
    })
    .default(Provider.PASSWORD),
});

export const signUpSchema = z
  .object({
    confirmPassword: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
    username: z.string().max(50, "이름은 50글자 이하여야 합니다.").optional(),
  })
  .merge(signInSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export const tokenSchema = z.object({
  refreshToken: z.string().min(1, "토큰이 필요합니다."),
});

export const schema = {
  signIn: signInSchema,
  signUp: signUpSchema,
  token: tokenSchema,
};

export type FormFieldSignInSchema = z.infer<typeof schema.signIn>;

export type FormFieldSignUpSchema = z.infer<typeof schema.signUp>;

export type FormFieldTokenSchema = z.infer<typeof schema.token>;
