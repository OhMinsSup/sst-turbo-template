import { Outlet } from "@remix-run/react";

import { DashboardHeader } from "~/components/shared/DashboardHeader";
import { Sidebar } from "~/components/shared/Sidebar";
import { SidebarMenuDashboard } from "~/components/shared/SidebarMenu";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function Routes() {
  return (
    <Sidebar
      noDisplayTitle
      to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT}
      menu={<SidebarMenuDashboard />}
      dashboardTitle={<DashboardHeader />}
    >
      <Outlet />
    </Sidebar>
  );
}
