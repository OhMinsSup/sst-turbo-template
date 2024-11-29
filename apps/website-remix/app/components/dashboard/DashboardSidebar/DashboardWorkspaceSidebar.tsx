import type { LinkProps } from "@remix-run/react";
import React from "react";

import type { components } from "@template/api-types";
import { ScrollArea } from "@template/ui/components/scroll-area";
import {
  SidebarHeader as ShadcnSidebarHeader,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@template/ui/components/sidebar";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import SidebarEtcNav from "./SidebarEtcNav";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarWorkspaceNav } from "./SidebarWorkspaceNav";

export interface WorkspaceMenuItem extends LinkProps {
  discover?: "render" | "none";
  prefetch?: "intent" | "render" | "none" | "viewport";
  meta: components["schemas"]["WorkspaceEntity"];
  title: string;
  icon?: React.ElementType;
  isActive?: boolean;
}

function generateWorkspaceItems(
  workspaces: components["schemas"]["WorkspaceEntity"][],
): WorkspaceMenuItem[] {
  return workspaces.map((workspace) => ({
    meta: workspace,
    title: workspace.title,
    to: PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ID(workspace.id),
    icon: Icons.Command,
    viewTransition: true,
  }));
}

export interface DashboardWorkspaceSidebarProps {
  workspaces: components["schemas"]["WorkspaceEntity"][];
}

export default function DashboardWorkspaceSidebar({
  workspaces,
}: DashboardWorkspaceSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="bg-background">
      <ShadcnSidebarHeader>
        <SidebarLogo />
      </ShadcnSidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <SidebarWorkspaceNav
            title="즐겨찾기"
            type="favorite"
            items={generateWorkspaceItems([])}
            emptyMessage="즐겨찾기한 워크스페이스가 없습니다."
          />
          <SidebarWorkspaceNav
            type="default"
            title="워크스페이스"
            items={generateWorkspaceItems(workspaces)}
          />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarEtcNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
