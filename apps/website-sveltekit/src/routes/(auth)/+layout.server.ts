import { redirect } from "@sveltejs/kit";
import { privateConfig } from "$lib/config/config.private.js";

import { HttpStatus } from "@template/sdk/enum";

import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
  const accessToken = event.cookies.get(privateConfig.token.accessTokenKey);
  if (accessToken) {
    redirect(HttpStatus.TEMPORARY_REDIRECT, "/");
  }
  return {};
}) satisfies LayoutServerLoad;
