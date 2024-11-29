import React from "react";

import { SidebarInset, SidebarProvider } from "@template/ui/components/sidebar";

import type { DashboardWorkspaceSidebarProps } from "../DashboardSidebar";
import { DashboardWorkspaceSidebar } from "../DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps
  extends Pick<DashboardWorkspaceSidebarProps, "workspaces"> {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
  workspaces,
}: DashboardLayoutProps) {
  return (
    <div className="relative bg-background">
      <SidebarProvider>
        <DashboardWorkspaceSidebar workspaces={workspaces} />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
