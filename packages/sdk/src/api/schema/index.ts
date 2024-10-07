import { schema as authSchema } from "./auth.schema";
import { schema as postSchema } from "./post.schema";
import { schema as userSchema } from "./user.schema";

export type {
  FormFieldRefreshTokenSchema,
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
  FormFieldVerifyTokenSchema,
  FormFieldSignoutSchema,
} from "./auth.schema";

export type {
  FormFieldCreatePostSchema,
  QueryGetInfinitePostSchema,
} from "./post.schema";

export type { ParamsByUserIdSchema } from "./user.schema";

export const schema = {
  ...authSchema,
  ...postSchema,
  ...userSchema,
};

export type Schema = typeof schema;
