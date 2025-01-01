import React from "react";

import {
  Sidebar as ShadcnSidebar,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
} from "@template/ui/components/sidebar";

import type { SidebarLayoutProps } from "~/components/shared/SidebarLayout";
import type { SidebarLogoProps } from "~/components/shared/SidebarLogo";
import { SidebarLayout } from "~/components/shared/SidebarLayout";
import { SidebarLogo } from "~/components/shared/SidebarLogo";

interface SidebarProps
  extends SidebarLogoProps,
    Omit<SidebarLayoutProps, "children"> {
  hiddenTitle?: boolean;
  menu?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Sidebar({
  to,
  hiddenTitle,
  menu,
  footer,
  children,
  ...sidebarLayoutProps
}: SidebarProps) {
  return (
    <>
      <ShadcnSidebar collapsible="icon" className="bg-background">
        {hiddenTitle ? null : (
          <ShadcnSidebarHeader>
            <SidebarLogo to={to} />
          </ShadcnSidebarHeader>
        )}
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
