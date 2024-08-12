import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  SESSION_SECRET,
} from "$env/static/private";

/** Only place private configurations here. */
export const privateConfig = {
  token: {
    accessTokenKey: ACCESS_TOKEN_NAME,
    refreshTokenKey: REFRESH_TOKEN_NAME,
  },
  sessionSecret: SESSION_SECRET,
};
