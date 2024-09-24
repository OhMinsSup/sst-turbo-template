import cookie from "cookie";

import { SESSION_DATA_KEY } from "~/constants/constants";

export type Theme = "light" | "dark";

export function getTheme(request: Request): Theme | null {
  const cookieHeader = request.headers.get("cookie");
  const parsed = cookieHeader
    ? cookie.parse(cookieHeader)[SESSION_DATA_KEY.themeKey]
    : "light";
  if (parsed === "light" || parsed === "dark") return parsed;
  return null;
}

export function setTheme(theme: Theme | "system") {
  if (theme === "system") {
    return cookie.serialize(SESSION_DATA_KEY.themeKey, "", {
      path: "/",
      maxAge: -1,
    });
  } else {
    return cookie.serialize(SESSION_DATA_KEY.themeKey, theme, {
      path: "/",
      maxAge: 31536000,
    });
  }
}
