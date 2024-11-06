import { Outlet } from "@remix-run/react";

import { SignUpLayout } from "~/components/auth/SignUpLayout";

export default function Routes() {
  return (
    <SignUpLayout>
      <Outlet />
    </SignUpLayout>
  );
}
