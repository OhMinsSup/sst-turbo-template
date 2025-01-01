import React from "react";

import type { DashboardTitleProps } from "~/components/shared/DashboardHeader";
import { DashboardTitle } from "~/components/shared/DashboardHeader";

export interface SidebarLayoutProps
  extends Pick<DashboardTitleProps, "noDisplayTitle"> {
  children: React.ReactNode;
  dashboardTitle?: React.ReactNode;
}

export default function SidebarLayout({
  children,
  dashboardTitle,
  noDisplayTitle,
}: SidebarLayoutProps) {
  return (
    <>
      {dashboardTitle}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardTitle noDisplayTitle={noDisplayTitle}>
          {children}
        </DashboardTitle>
      </div>
    </>
  );
}
