import { redirect } from "@sveltejs/kit";
import { TOKEN_KEY } from "$lib/server/auth";

import { HttpStatus } from "@template/sdk/enum";

import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
  const accessToken = event.cookies.get(TOKEN_KEY.ACCESS_TOKEN);
  if (accessToken) {
    redirect(HttpStatus.TEMPORARY_REDIRECT, "/");
  }
  return {};
}) satisfies LayoutServerLoad;
