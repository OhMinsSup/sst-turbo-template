import { useFetcher } from "@remix-run/react";

import { Label } from "@template/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@template/ui/components/radio-group";

import type { RoutesActionData } from "~/.server/actions/theme.action";
import { useRequestInfo } from "~/hooks/useRequestInfo";
import { useOptimisticThemeMode } from "~/libs/theme";

export function AppearanceForm() {
  const fetcher = useFetcher<RoutesActionData>();
  const requestInfo = useRequestInfo();

  const optimisticMode = useOptimisticThemeMode();
  const mode = optimisticMode ?? requestInfo.userPrefs.theme ?? "system";

  const onThemeValueChange = (value: string) => {
    const formData = new FormData();
    formData.append("theme", value);
    if (requestInfo.path) {
      formData.append("redirectTo", requestInfo.path);
    }
    fetcher.submit(formData, {
      method: "post",
      action: "/theme-switch",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="flex flex-col">
      <RadioGroup
        className="grid max-w-screen-md grid-cols-1 gap-8 pt-2 md:grid-cols-3"
        value={mode}
        onValueChange={onThemeValueChange}
      >
        <div>
          <RadioGroupItem value="light" id="light" className="peer sr-only" />
          <Label
            htmlFor="light"
            className="flex flex-col rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="size-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="size-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
          </Label>
          <span className="block w-full p-2 text-center font-normal">
            라이트
          </span>
        </div>
        <div>
          <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
          <Label
            htmlFor="dark"
            className="flex flex-col rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
              <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="size-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="size-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
          </Label>
          <span className="block w-full p-2 text-center font-normal">다크</span>
        </div>
        <div>
          <RadioGroupItem value="system" id="system" className="peer sr-only" />
          <Label
            htmlFor="system"
            className="flex flex-col rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
          </Label>
          <span className="block w-full p-2 text-center font-normal">
            시스템
          </span>
        </div>
      </RadioGroup>
    </div>
  );
}
