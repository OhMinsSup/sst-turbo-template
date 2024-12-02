import type { LinkProps } from "@remix-run/react";
import React from "react";
import { useLoaderData } from "@remix-run/react";

import type { components } from "@template/api-types";
import { ScrollArea } from "@template/ui/components/scroll-area";
import {
  SidebarHeader as ShadcnSidebarHeader,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@template/ui/components/sidebar";

import type { RoutesLoaderData } from "~/.server/routes/dashboard/dashboard.loader";
import { DashboardSidebarProvider } from "./context";
import SidebarEtcNav from "./SidebarEtcNav";
import { SidebarLogo } from "./SidebarLogo";
import { WorkspaceType } from "./SidebarWorkspaceMneuItems";
import { SidebarWorkspaceNav } from "./SidebarWorkspaceNav";

export interface WorkspaceMenuItem extends LinkProps {
  discover?: "render" | "none";
  prefetch?: "intent" | "render" | "none" | "viewport";
  meta: components["schemas"]["WorkspaceEntity"];
  title: string;
  icon?: React.ElementType;
  isActive?: boolean;
}

export default function DashboardWorkspaceSidebar() {
  const data = useLoaderData<RoutesLoaderData>();

  return (
    <DashboardSidebarProvider>
      <Sidebar collapsible="icon" className="bg-background">
        <ShadcnSidebarHeader>
          <SidebarLogo />
        </ShadcnSidebarHeader>
        <SidebarContent>
          <ScrollArea>
            <SidebarWorkspaceNav
              workspaceType={WorkspaceType.Default}
              title="워크스페이스"
              items={data.workspaces}
            />
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
          <SidebarEtcNav />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </DashboardSidebarProvider>
  );
}
