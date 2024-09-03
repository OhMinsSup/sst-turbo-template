import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createAuthServerClient } from "@template/sdk/auth";

import { env } from "~/env";

export async function updateSession(request: NextRequest) {
  let clientResponse = NextResponse.next({
    request,
  });

  const authenticates = createAuthServerClient({
    url: env.NEXT_PUBLIC_SERVER_URL,
    logDebugMessages: false,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        clientResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          clientResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createAuthServerClient and
  // authenticates.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const { user } = await authenticates.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/signin") &&
    !request.nextUrl.pathname.startsWith("/signup")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the clientResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(clientResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!
  return clientResponse;
}
