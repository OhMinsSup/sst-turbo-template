/** Only place public configurations here. */
import { NEXT_PUBLIC_SERVER_URL } from "$env/static/public";

export const publicConfig = {
  SERVER_URL: NEXT_PUBLIC_SERVER_URL || "http://localhost:8080",
};
