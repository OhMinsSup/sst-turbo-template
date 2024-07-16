import { fail } from "@sveltejs/kit";
import { getApiClient } from "$lib/api-client.js";
import { TOKEN_KEY } from "$lib/server/auth.js";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import type { ClientResponse } from "@template/sdk";
import { HttpResultStatus, HttpStatus } from "@template/sdk/enum";
import { FetchError } from "@template/sdk/error";
import { authSchema } from "@template/sdk/schema";

import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(authSchema.signIn)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(authSchema.signIn));
    if (!form.valid) {
      return fail(HttpStatus.BAD_REQUEST, {
        form,
      });
    }

    try {
      const response = await getApiClient().rpc("signIn").post(form.data);

      const {
        result: { tokens },
      } = response;

      event.cookies.set(TOKEN_KEY.ACCESS_TOKEN, tokens.accessToken.token, {
        httpOnly: true,
        expires: new Date(tokens.accessToken.expiresAt),
        path: "/",
        sameSite: "lax",
      });
      event.cookies.set(TOKEN_KEY.REFRESH_TOKEN, tokens.refreshToken.token, {
        httpOnly: true,
        expires: new Date(tokens.refreshToken.expiresAt),
        path: "/",
        sameSite: "lax",
      });

      return {
        form,
      };
    } catch (e) {
      console.error(e);
      if (e instanceof FetchError) {
        const data: ClientResponse<null> = e.data;
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
  },
};
