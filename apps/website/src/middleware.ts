export { auth as middleware } from "@template/auth";

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico).*)"
    "/((?!api|manifest.webmanifest|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
