import { Outlet } from "@remix-run/react";

import { DashboardLayout } from "~/components/shared/DashboardLayout";

export default function Routes() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
