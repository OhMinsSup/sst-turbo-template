import React from "react";

import {
  SidebarHeader as ShadcnSidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
} from "@template/ui/components/sidebar";
import { MEDIA_QUERY, useMediaQuery } from "@template/ui/hooks";

import type { SidebarLayoutProps } from "~/components/shared/SidebarLayout";
import type { SidebarLogoProps } from "~/components/shared/SidebarLogo";
import { Sidebar as ShadcnSidebar } from "~/components/shared/Sidebar/ShadcnSidebar";
import { SidebarLayout } from "~/components/shared/SidebarLayout";
import { SidebarLogo } from "~/components/shared/SidebarLogo";

interface SidebarProps
  extends SidebarLogoProps,
    Omit<SidebarLayoutProps, "children"> {
  menu?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Sidebar({
  to,
  menu,
  footer,
  children,
  ...sidebarLayoutProps
}: SidebarProps) {
  const isMobile = useMediaQuery(MEDIA_QUERY.small, false);
  return (
    <>
      <ShadcnSidebar
        collapsible="icon"
        className="bg-background"
        side={isMobile ? "bottom" : "left"}
        sidebarWidth={isMobile ? "100%" : "18rem"}
      >
        <ShadcnSidebarHeader>
          <SidebarLogo to={to} />
        </ShadcnSidebarHeader>
        {menu ? <SidebarContent>{menu}</SidebarContent> : null}
        {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
        <SidebarRail />
      </ShadcnSidebar>
      <SidebarInset>
        <SidebarLayout {...sidebarLayoutProps}>{children}</SidebarLayout>
      </SidebarInset>
    </>
  );
}
