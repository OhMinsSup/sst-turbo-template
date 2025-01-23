import { Outlet, useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/loaders/_private._workspaces.dashboard.workspaces.loader";
import { WorkspaceHeader } from "~/components/shared/DashboardHeader";
import { Sidebar } from "~/components/shared/Sidebar";
import { SidebarMenuWorkspace } from "~/components/shared/SidebarMenu";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export { loader } from "~/.server/loaders/_private._workspaces.dashboard.workspaces.loader";

export default function Routes() {
  const { workspaceId } = useLoaderData<RoutesLoaderData>();
  return (
    <Sidebar
      noDisplayTitle
      noPadding
      to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT}
      menu={<SidebarMenuWorkspace workspaceId={workspaceId} />}
      dashboardTitle={<WorkspaceHeader />}
      footer={<SidebarMenuWorkspace.Footer workspaceId={workspaceId} />}
    >
      <Outlet />
    </Sidebar>
  );
}
