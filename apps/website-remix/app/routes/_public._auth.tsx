import { Outlet } from "@remix-run/react";

import { AuthLayout } from "~/components/auth/AuthLayout";
import { ErrorBoundary as DefaultErrorBoundary } from "~/components/shared/ErrorBoundary";

export default function Routes() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

export function ErrorBoundary() {
  return <DefaultErrorBoundary />;
}
