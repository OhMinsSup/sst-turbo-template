import { Link, useLocation } from "@remix-run/react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@template/ui/components/sidebar";
import { cn } from "@template/ui/lib";

import { Icons } from "~/components/icons";
import { SidebarMenuNav } from "~/components/shared/SidebarMenuNav";
import { User } from "~/components/shared/User";
import { PAGE_ENDPOINTS } from "~/constants/constants";

interface SidebarMenuWorkspaceProps {
  workspaceId: string;
}

export default function SidebarMenuWorkspace({
  workspaceId,
}: SidebarMenuWorkspaceProps) {
  const location = useLocation();
  const { state } = useSidebar();
  console.log(state);
  return (
    <>
      <SidebarMenuNav>
        <SidebarMenuButton tooltip={"대시보드"} asChild>
          <Icons.Database />
        </SidebarMenuButton>
      </SidebarMenuNav>
      <SidebarSeparator className="bg-muted" />
      <SidebarMenuNav>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"테이블"} asChild>
            <Link
              to={PAGE_ENDPOINTS.PROTECTED.WORKSPACE.EDITOR.ROOT(workspaceId)}
              viewTransition
              className={cn(
                location.pathname ===
                  PAGE_ENDPOINTS.PROTECTED.WORKSPACE.EDITOR.ROOT(workspaceId)
                  ? "bg-accent text-accent-foreground"
                  : undefined,
              )}
            >
              <Icons.TableProperties />
              <span className="w-full">테이블</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenuNav>
    </>
  );
}

type SidebarMenuWorkspaceFooterProps = SidebarMenuWorkspaceProps;

SidebarMenuWorkspace.Footer = function SidebarMenuWorkspaceFooter({
  workspaceId,
}: SidebarMenuWorkspaceFooterProps) {
  const location = useLocation();
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"워크스페이스 설정"} asChild>
            <Link
              to={PAGE_ENDPOINTS.PROTECTED.WORKSPACE.SETTINGS.GENERAL(
                workspaceId,
              )}
              viewTransition
              className={cn(
                location.pathname ===
                  PAGE_ENDPOINTS.PROTECTED.WORKSPACE.SETTINGS.GENERAL(
                    workspaceId,
                  )
                  ? "bg-accent text-accent-foreground"
                  : undefined,
              )}
            >
              <Icons.Settings />
              <span className="w-full">워크스페이스 설정</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <User />
    </>
  );
};
