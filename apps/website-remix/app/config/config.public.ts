/** Only place public configurations here. */
import { NEXT_PUBLIC_SERVER_URL } from "$env/static/public";

export const publicConfig = {
  serverUrl: NEXT_PUBLIC_SERVER_URL || "http://localhost:8080",
  isProd: import.meta.env.PROD,
};
