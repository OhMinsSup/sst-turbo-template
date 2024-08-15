/** Only place public configurations here. */
import {
  NEXT_PUBLIC_ACCESS_TOKEN_NAME,
  NEXT_PUBLIC_REFRESH_TOKEN_NAME,
  NEXT_PUBLIC_SERVER_URL,
} from "$env/static/public";

export const publicConfig = {
  serverUrl: NEXT_PUBLIC_SERVER_URL || "http://localhost:8080",
  token: {
    accessTokenKey: NEXT_PUBLIC_ACCESS_TOKEN_NAME,
    refreshTokenKey: NEXT_PUBLIC_REFRESH_TOKEN_NAME,
  },
};
