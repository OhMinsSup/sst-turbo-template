import { Outlet, useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/dashboard/dashboard.loader";
import { DashboardLayout } from "~/components/dashboard/DashboardLayout";

export { loader } from "~/.server/routes/dashboard/dashboard.loader";
export { action } from "~/.server/routes/dashboard/dashboard.action";

export default function Routes() {
  const data = useLoaderData<RoutesLoaderData>();
  return (
    <DashboardLayout workspaces={data.workspaces}>
      <Outlet />
    </DashboardLayout>
  );
}
