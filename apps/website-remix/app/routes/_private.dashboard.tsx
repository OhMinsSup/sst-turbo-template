import React from "react";
import { Outlet } from "@remix-run/react";

import { DashboardLayout } from "~/components/dashboard/DashboardLayout";

export default function Routes() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
