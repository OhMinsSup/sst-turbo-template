import { Outlet } from "@remix-run/react";

import { DashboardLayout } from "~/components/dashboard/DashboardLayout";

export { loader } from "~/.server/routes/dashboard/dashboard.loader";

export default function Routes() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
