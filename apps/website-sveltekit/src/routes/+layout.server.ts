import { getAuthFormRequest } from "$lib/server/auth";

import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
  const data = await getAuthFormRequest(event);
  console.log("layout server load", data);
  return {
    data,
  };
}) satisfies LayoutServerLoad;
