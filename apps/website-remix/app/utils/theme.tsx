import { useFetchers } from "@remix-run/react";
import { z } from "zod";

import { useRequestInfo } from "~/hooks/useRequestInfo";
import { useHints } from "~/utils/client-hints";

export const themeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  // this is useful for progressive enhancement
  redirectTo: z.string().optional().nullable(),
});

export type FomrFieldThemeSchema = z.infer<typeof themeSchema>;

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticThemeMode() {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find((f) => f.formAction === "/theme-switch");

  if (themeFetcher && themeFetcher.formData) {
    const input = {
      theme: themeFetcher.formData.get(
        "theme",
      ) as FomrFieldThemeSchema["theme"],
      redirectTo: themeFetcher.formData.get(
        "redirectTo",
      ) as FomrFieldThemeSchema["redirectTo"],
    };
    const parsed = themeSchema.safeParse(input);

    if (parsed.success) {
      return parsed.data.theme;
    }
  }
}

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
  const hints = useHints();
  const userPrefs = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();
  if (optimisticMode) {
    return optimisticMode === "system" ? hints.theme : optimisticMode;
  }
  return userPrefs.userPrefs.theme ?? hints.theme;
}
