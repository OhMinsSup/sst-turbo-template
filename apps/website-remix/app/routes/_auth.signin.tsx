import React from "react";
import { Outlet } from "@remix-run/react";

import { SignInLayout } from "~/components/auth/SignInLayout";

export default function Routes() {
  return (
    <SignInLayout>
      <Outlet />
    </SignInLayout>
  );
}
