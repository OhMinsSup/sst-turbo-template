import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import type { ClientResponse } from "@template/sdk";
import {
  HttpResultStatus,
  HttpStatus,
  isFetchError,
  schema,
} from "@template/sdk";

import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async (event) => {
  return {
    form: await superValidate(zod(schema.signIn)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(schema.signIn));
    if (!form.valid) {
      return fail(HttpStatus.BAD_REQUEST, {
        form,
      });
    }

    let isRedirect = false;

    try {
      await event.locals.authenticates.signIn(form.data, true);

      isRedirect = true;
    } catch (e) {
      isRedirect = false;
      if (isFetchError<ClientResponse>(e) && e.data) {
        const data = e.data;
        switch (data.resultCode) {
          case HttpResultStatus.NOT_EXIST: {
            const message = Object.values(
              (data.message ?? {}) as Record<string, Record<string, string>>,
            ).map((value) => value.message);
            return setError(form, "email", message);
          }
          case HttpResultStatus.INCORRECT_PASSWORD: {
            const message = Object.values(
              (data.message ?? {}) as Record<string, Record<string, string>>,
            ).map((value) => value.message);
            return setError(form, "password", message);
          }
          default: {
            return fail(e.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR, {
              form,
            });
          }
        }
      }
      return fail(HttpStatus.INTERNAL_SERVER_ERROR, {
        form,
      });
    }

    if (isRedirect) {
      redirect(HttpStatus.TEMPORARY_REDIRECT, "/");
    }
  },
};
