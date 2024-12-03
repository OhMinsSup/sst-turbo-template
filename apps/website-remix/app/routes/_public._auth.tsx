import { Outlet } from "@remix-run/react";

import { AuthLayout } from "~/components/auth/AuthLayout";

export default function Routes() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
