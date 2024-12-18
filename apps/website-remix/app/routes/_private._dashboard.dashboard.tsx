import type { ActionFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { SidebarInset } from "@template/ui/components/sidebar";

import { DashboardMenu } from "~/components/dashboard/DashboardMenu";
import { DashboardHeader } from "~/components/shared/DashboardHeader";
import { Layout } from "~/components/shared/Layout";
import { Sidebar } from "~/components/shared/Sidebar";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export const action = async (args: ActionFunctionArgs) => {
  console.log("Dashboard action", args.request.url);
  const formData = await args.request.formData();
  const body = Object.fromEntries(formData);
  console.log("Dashboard action body", body);
  return {};
};

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
