import React from "react";

import { auth } from "@template/auth";

import { AuthSample } from "~/components/shared/AuthSample";

export default async function Page() {
  const session = await auth();

  console.log(session);
  return (
    <React.Suspense fallback={<></>}>
      <AuthSample />
    </React.Suspense>
  );
}
