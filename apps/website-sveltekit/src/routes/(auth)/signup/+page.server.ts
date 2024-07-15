import { fail } from "@sveltejs/kit";
import { getApiClient } from "$lib/api-client.js";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { HttpStatus } from "@template/sdk/enum";
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
      return fail(HttpStatus.BAD_REQUEST, {
        form,
      });
    }

    const response = await getApiClient().rpc("signUp").post(form.data);
    console.log(response);
    // if (response.error) {
    //   const message = response.message
    //   return setError(form, response.error, [])
    // }

    return {
      form,
    };
  },
};
