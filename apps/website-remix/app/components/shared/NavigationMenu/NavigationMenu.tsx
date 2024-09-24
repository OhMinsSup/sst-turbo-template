import React from "react";
import { useFetcher } from "@remix-run/react";

import { cn } from "@template/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@template/ui/dropdown-menu";

import { RoutesActionData } from "~/.server/routes/resources/theme.action";
import { Icons } from "~/components/icons";
import { useRequestInfo } from "~/hooks/useRequestInfo";
import { useOptimisticThemeMode } from "~/utils/theme";

export default function NavigationMenu() {
  const fetcher = useFetcher<RoutesActionData>();
  const requestInfo = useRequestInfo();

  const optimisticMode = useOptimisticThemeMode();
  const mode = optimisticMode ?? requestInfo.userPrefs.theme ?? "system";

  const onThemeChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const theme = e.currentTarget.getAttribute("data-value") ?? "system";
    const formData = new FormData();
    formData.append("theme", theme);
    formData.append("redirectTo", requestInfo.path);
    fetcher.submit(formData, {
      action: "/theme-switch",
      encType: "multipart/form-data",
      method: "post",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Icons.menu className="h-[22px] w-[22px] transform cursor-pointer text-slate-300 transition-all duration-150 ease-out hover:scale-100 hover:text-foreground active:scale-90 active:text-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-[999] mt-1 w-[185px] rounded-2xl bg-background p-0 shadow-xl dark:bg-[#181818]"
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground">
            디자인
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                data-value="light"
                arial-label="Toggle theme"
                aria-selected={mode === "light"}
                className={cn("items-center justify-center", {
                  "bg-accent text-accent-foreground": mode === "light",
                })}
                onClick={onThemeChange}
              >
                <Icons.sun />
                <span className="sr-only">Toggle theme</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                data-value="dark"
                arial-label="Toggle theme"
                aria-selected={mode === "dark"}
                className={cn("items-center justify-center", {
                  "bg-accent text-accent-foreground": mode === "dark",
                })}
                onClick={onThemeChange}
              >
                <Icons.moon />
                <span className="sr-only">Toggle theme</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn("items-center justify-center", {
                  "bg-accent text-accent-foreground":
                    mode === "system" || !mode,
                })}
                arial-label="Toggle theme"
                aria-selected={mode === "system" || !mode}
                data-value="system"
                onClick={onThemeChange}
              >
                <Icons.laptop />
                <span className="sr-only">Toggle theme</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator className="my-0 h-[1.2px]" />
        <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground">
          설정
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-0 h-[1.2px]" />
        <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground">
          문제 신고
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-0 h-[1.2px]" />
        <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground">
          <div aria-label="Log out">로그아웃</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
