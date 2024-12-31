import { Link } from "@remix-run/react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@template/ui/components/sidebar";

import { Icons } from "~/components/icons";
import { SidebarMenuNav } from "~/components/shared/SidebarMenuNav";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export function TypeTableMenu() {
  return (
    <>
      <SidebarMenuNav title={<></>} usedSortingComponent={false}>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"워크스페이스"} asChild>
            <Link to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT} viewTransition>
              <Icons.Database />
              <span className="w-full">워크스페이스</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenuNav>
      <SidebarMenuNav title={<></>} usedSortingComponent={false}>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"워크스페이스"} asChild>
            <Link to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT} viewTransition>
              <Icons.Database />
              <span className="w-full">워크스페이스</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenuNav>
    </>
  );
}
