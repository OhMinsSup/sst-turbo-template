import { Outlet } from "@remix-run/react";

import { SidebarInset } from "@template/ui/components/sidebar";

import { DashboardMenu } from "~/components/dashboard/DashboardMenu";
import { DashboardHeader } from "~/components/shared/DashboardHeader";
import { Layout } from "~/components/shared/Layout";
import { Sidebar } from "~/components/shared/Sidebar";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function Routes() {
  return (
    <>
      <Sidebar to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT}>
        <DashboardMenu />
      </Sidebar>
      <SidebarInset>
        <Layout noDisplayTitle dashboardTitle={<DashboardHeader />}>
          <Outlet />
        </Layout>
      </SidebarInset>
    </>
  );
}
