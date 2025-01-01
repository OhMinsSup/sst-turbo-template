import { Link, useFetcher, useLocation } from "@remix-run/react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@template/ui/components/sidebar";
import { cn } from "@template/ui/lib";

import type { RoutesActionData } from "~/.server/actions/signout.action";
import { Icons } from "~/components/icons";
import { SidebarMenuNav } from "~/components/shared/SidebarMenuNav";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { useRequestInfo } from "~/hooks/useRequestInfo";

export default function SidebarMenuDashboard() {
  const location = useLocation();
  const requestInfo = useRequestInfo();
  const fetcher = useFetcher<RoutesActionData>();

  return (
    <>
      <SidebarMenuNav title="메뉴" usedSortingComponent={false}>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"워크스페이스"} asChild>
            <Link
              to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT}
              viewTransition
              className={cn(
                location.pathname === PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT
                  ? "bg-accent text-accent-foreground"
                  : undefined,
              )}
            >
              <Icons.Database />
              <span className="w-full">워크스페이스</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenuNav>
      <SidebarSeparator className="bg-muted" />
      <SidebarMenuNav title="계정" usedSortingComponent={false}>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"환경설정"} asChild>
            <Link
              to={PAGE_ENDPOINTS.PROTECTED.PREFERENCES.ME}
              viewTransition
              className={cn(
                location.pathname === PAGE_ENDPOINTS.PROTECTED.PREFERENCES.ME
                  ? "bg-accent text-accent-foreground"
                  : undefined,
              )}
            >
              <Icons.Settings />
              <span className="w-full">환경설정</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenuNav>
      <SidebarSeparator className="bg-muted" />
      <SidebarMenuNav>
        <SidebarMenuItem>
          <fetcher.Form method="post" action="/signout">
            <input type="hidden" name="redirectTo" value={requestInfo.path} />
            <SidebarMenuButton tooltip={"로그아웃"} asChild>
              <button type="submit">
                <Icons.LogOut />
                <span>로그아웃</span>
              </button>
            </SidebarMenuButton>
          </fetcher.Form>
        </SidebarMenuItem>
      </SidebarMenuNav>
    </>
  );
}
