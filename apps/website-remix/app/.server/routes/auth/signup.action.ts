import type { ActionFunctionArgs } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { json } from "@remix-run/node";

import {
  ErrorDisplayType,
  HttpStatus,
  RequestMethod,
} from "@template/sdk/enum";
import { createHttpError } from "@template/sdk/error";
import { authSchema } from "@template/sdk/schema";

import {
  errorJsonDataResponse,
  successJsonDataResponse,
} from "~/.server/utils/response";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method.toUpperCase() !== RequestMethod.POST) {
    throw createHttpError({
      statusMessage: "Method Not Allowed",
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      displayType: ErrorDisplayType.TOAST,
      data: "not allowed method",
    });
  }

  const formData = await request.formData();
  const submittedData = parseWithZod(formData, {
    schema: authSchema.signUp,
  });

  if (submittedData.status !== "success") {
    return json(errorJsonDataResponse(submittedData.error));
  }

  return json(successJsonDataResponse(null));
};

export type RoutesActionData = typeof action;
