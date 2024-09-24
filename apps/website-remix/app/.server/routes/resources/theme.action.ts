import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { invariantResponse } from "@epic-web/invariant";

import type { FomrFieldThemeSchema } from "~/utils/theme";
import { successJsonDataResponse } from "~/.server/utils/response";
import { setTheme } from "~/.server/utils/theme";
import { themeSchema } from "~/utils/theme";

export const action = async (ctx: ActionFunctionArgs) => {
  const formData = await ctx.request.formData();

  const input = {
    theme: formData.get("theme") as FomrFieldThemeSchema["theme"],
    redirectTo: formData.get(
      "redirectTo",
    ) as FomrFieldThemeSchema["redirectTo"],
  };

  const parsed = themeSchema.safeParse(input);
  invariantResponse(parsed.success, "Invalid theme received");

  const { theme, redirectTo } = parsed.data;

  const responseInit = {
    headers: { "set-cookie": setTheme(theme) },
  };
  if (redirectTo) {
    return redirect(redirectTo, responseInit);
  } else {
    return json(successJsonDataResponse(true), responseInit);
  }
};

export type RoutesActionData = typeof action;
