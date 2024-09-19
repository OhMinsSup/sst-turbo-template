import { Honeypot, SpamError } from "remix-utils/honeypot/server";

import { createHttpError, HttpStatus } from "@template/sdk";

import { privateConfig } from "~/config/config.private";

export const honeypot = new Honeypot({
  validFromFieldName: privateConfig.nodeEnv === "test" ? null : undefined,
  encryptionSeed: privateConfig.sessionSecret,
});

export function checkHoneypot(formData: FormData) {
  try {
    honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      throw createHttpError({
        statusMessage: "Form not submitted properly",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    throw error;
  }
}
