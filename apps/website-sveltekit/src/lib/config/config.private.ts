import { env as privateEnv } from "$env/dynamic/private";

/** Only place private configurations here. */
export const privateConfig = {
  token: {
    accessTokenKey: privateEnv.ACCESS_TOKEN_NAME,
    refreshTokenKey: privateEnv.REFRESH_TOKEN_NAME,
  },
};
