import { NODE_ENV, SESSION_SECRET } from "$env/static/private";

/** Only place private configurations here. */
export const privateConfig = {
  sessionSecret: SESSION_SECRET,
  isProd: NODE_ENV === "production",
};
