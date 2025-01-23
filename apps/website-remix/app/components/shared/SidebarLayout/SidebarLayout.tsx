import React from "react";

import { cn } from "@template/ui/lib";

import type { DashboardTitleProps } from "~/components/shared/DashboardHeader";
import { DashboardTitle } from "~/components/shared/DashboardHeader";

export interface SidebarLayoutProps
  extends Pick<DashboardTitleProps, "noDisplayTitle"> {
  children: React.ReactNode;
  dashboardTitle?: React.ReactNode;
  noPadding?: boolean;
}

export default function SidebarLayout({
  children,
  dashboardTitle,
  noDisplayTitle,
  noPadding,
}: SidebarLayoutProps) {
  return (
    <>
      {dashboardTitle}
      <div
        className={cn("flex flex-1 flex-col gap-4", {
          "p-0": noPadding,
          "p-4 pt-0": !noPadding,
        })}
      >
        <DashboardTitle noDisplayTitle={noDisplayTitle} noPadding={noPadding}>
          {children}
        </DashboardTitle>
      </div>
    </>
  );
}
