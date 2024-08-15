import type { AuthClientOptions } from "./types";

type Options = AuthClientOptions & {
  // cookieOptions?: CookieOptionsWithName;
  // cookies: CookieMethodsServer;
  cookieEncoding?: "raw" | "base64url";
};

export function createAuthServerClient(options: Options) {
  return {};
}
