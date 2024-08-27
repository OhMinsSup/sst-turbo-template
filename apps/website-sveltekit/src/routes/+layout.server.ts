import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user } = await safeGetSession();

  const data = {
    env: import.meta.env,
    userPrefs: {
      theme: null,
    },
    toast: null,
    session,
    user,
    cookies: cookies.getAll(),
  };

  return data;
}) satisfies LayoutServerLoad;
