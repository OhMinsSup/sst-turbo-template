import { useFetcher } from "@remix-run/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@template/ui/components/select";

import type { RoutesActionData } from "~/.server/actions/theme.action";
import { useRequestInfo } from "~/hooks/useRequestInfo";
import { useOptimisticThemeMode } from "~/libs/theme";

export function SelectTheme() {
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
    <Select value={mode} onValueChange={onThemeValueChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="system">시스템</SelectItem>
        <SelectItem value="dark">다크</SelectItem>
        <SelectItem value="light">라이트</SelectItem>
      </SelectContent>
    </Select>
  );
}
