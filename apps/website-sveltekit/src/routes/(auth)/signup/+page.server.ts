import { fail, redirect } from "@sveltejs/kit";
import { getApiClient } from "$lib/api";
import { privateConfig } from "$lib/config/config.private.js";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import type { ClientResponse } from "@template/sdk";
import { HttpResultStatus, HttpStatus } from "@template/sdk/enum";
import { FetchError } from "@template/sdk/error";
import { authSchema } from "@template/sdk/schema";

import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async (event) => {
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

    let isRedirect = false;

    try {
      const response = await getApiClient().rpc("signUp").post(form.data);

      const {
        result: { tokens },
      } = response;

      event.cookies.set(
        privateConfig.token.accessTokenKey,
        tokens.accessToken.token,
        {
          httpOnly: true,
          expires: new Date(tokens.accessToken.expiresAt),
          path: "/",
          sameSite: "lax",
        },
      );
      event.cookies.set(
        privateConfig.token.refreshTokenKey,
        tokens.refreshToken.token,
        {
          httpOnly: true,
          expires: new Date(tokens.refreshToken.expiresAt),
          path: "/",
          sameSite: "lax",
        },
      );

      event.setHeaders({
        "X-Auth-Status": "true",
      });

      isRedirect = true;
    } catch (e) {
      isRedirect = false;
      if (e instanceof FetchError) {
        const data: ClientResponse<null> = e.data;
        switch (data.resultCode) {
          case HttpResultStatus.NOT_EXIST: {
            const message = Object.values(
              (data.message ?? {}) as Record<string, Record<string, string>>,
            ).map((value) => value.message);
            return setError(form, "email", message);
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
