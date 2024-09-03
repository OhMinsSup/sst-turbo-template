import React from "react";

import { AuthSample } from "~/components/shared/AuthSample";
import { createClient } from "~/libs/auth/server";

export default async function Page() {
  const data = await createClient().getSession();
  console.log(data);
  return (
    <React.Suspense fallback={<></>}>
      <AuthSample />
    </React.Suspense>
  );
}
