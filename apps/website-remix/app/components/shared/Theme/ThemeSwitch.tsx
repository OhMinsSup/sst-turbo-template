import { useFetcher } from "@remix-run/react";
import { ServerOnly } from "remix-utils/server-only";

import { Button } from "@template/ui/components/button";

import type { RoutesActionData } from "~/.server/routes/resources/theme.action";
import type { Theme } from "~/.server/utils/theme";
import { Icons } from "~/components/icons";
import { useRequestInfo } from "~/hooks/useRequestInfo";
import { useOptimisticThemeMode } from "~/utils/theme";

interface ThemeSwitchProps {
  userPreference?: Theme | null;
}

export default function ThemeSwitch({ userPreference }: ThemeSwitchProps) {
  const fetcher = useFetcher<RoutesActionData>();
  const requestInfo = useRequestInfo();

  const optimisticMode = useOptimisticThemeMode();
  const mode = optimisticMode ?? userPreference ?? "system";
  const nextMode =
    mode === "system" ? "light" : mode === "light" ? "dark" : "system";

  const modeLabel = {
    light: (
      <>
        <Icons.sun />
        <span className="sr-only">Toggle theme</span>
      </>
    ),
    dark: (
      <>
        <Icons.moon />
        <span className="sr-only">Toggle theme</span>
      </>
    ),
    system: (
      <>
        <Icons.laptop />
        <span className="sr-only">Toggle theme</span>
      </>
    ),
  };

  return (
    <fetcher.Form
      method="post"
      encType="multipart/form-data"
      action="/theme-switch"
    >
      <ServerOnly>
        {() => (
          <input type="hidden" name="redirectTo" value={requestInfo.path} />
        )}
      </ServerOnly>
      <input type="hidden" name="theme" value={nextMode} />
      <div className="flex gap-2">
        <Button type="submit" variant="outline" size="icon">
          {modeLabel[mode]}
        </Button>
      </div>
    </fetcher.Form>
  );
}
