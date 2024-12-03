import React from "react";

import { SidebarProvider } from "@template/ui/components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative bg-background">
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}
