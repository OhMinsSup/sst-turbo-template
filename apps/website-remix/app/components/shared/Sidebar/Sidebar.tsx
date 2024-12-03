import React from "react";

import { ScrollArea } from "@template/ui/components/scroll-area";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@template/ui/components/sidebar";

import type { SidebarLogoProps } from "~/components/shared/SidebarLogo";
import { SidebarLogo } from "~/components/shared/SidebarLogo";
import { SidebarSharedNav } from "~/components/shared/SidebarSharedNav";

interface SidebarProps extends SidebarLogoProps {
  children?: React.ReactNode;
}

export default function Sidebar({ children, to }: SidebarProps) {
  return (
    <ShadcnSidebar collapsible="icon" className="bg-background">
      <ShadcnSidebarHeader>
        <SidebarLogo to={to} />
      </ShadcnSidebarHeader>
      <SidebarContent>
        <ScrollArea>{children}</ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSharedNav />
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  );
}
