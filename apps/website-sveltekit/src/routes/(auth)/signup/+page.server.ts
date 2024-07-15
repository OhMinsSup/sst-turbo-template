import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { authSchema } from "@template/sdk/schema";

import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(authSchema.signUp)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(authSchema.signUp));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return {
      form,
    };
  },
};
