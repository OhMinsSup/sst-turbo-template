/** Only place public configurations here. */
import { env } from "$env/dynamic/public";

export const publicConfig = {
  SERVER_URL: env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080",
};
