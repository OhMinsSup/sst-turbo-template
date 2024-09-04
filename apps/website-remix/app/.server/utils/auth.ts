import {
  createAuthServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@template/sdk/auth/server";

interface CreateRemixServerClientOptions {
  headers: Headers;
  request: Request;
}

export const createRemixServerClient = ({
  request,
  headers,
}: CreateRemixServerClientOptions) => {
  return createAuthServerClient({
    url: import.meta.env.NEXT_PUBLIC_SERVER_URL,
    logDebugMessages: false,
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    },
  });
};
