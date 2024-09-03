import type { NextRequest } from "next/server";

import { updateSession } from "~/libs/middlewares/auth";

export async function middleware(request: NextRequest) {
  console.log("middleware");
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
