import { useFetcher } from "@remix-run/react";

import { Button } from "@template/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@template/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@template/ui/components/sidebar";

import type { RoutesActionData } from "~/.server/actions/signout.action";
import { Icons } from "~/components/icons";
import { useRequestInfo } from "~/hooks/useRequestInfo";
import { useUser } from "~/hooks/useUser";
import { SelectTheme } from "./SelectTheme";
import { UserImage } from "./UserImage";

export default function User() {
  const user = useUser();

  const requestInfo = useRequestInfo();
  const fetcher = useFetcher<RoutesActionData>();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserImage className="size-8 rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <Icons.ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserImage className="h-8 w-8 rounded-lg" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-between">
              테마
              <SelectTheme />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <fetcher.Form
                method="post"
                action="/signout"
                className="size-full"
              >
                <input
                  type="hidden"
                  name="redirectTo"
                  value={requestInfo.path}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start"
                >
                  로그아웃
                </Button>
              </fetcher.Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
