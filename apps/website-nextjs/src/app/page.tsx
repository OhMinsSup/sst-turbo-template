import React from "react";

import { AuthSample } from "~/components/shared/AuthSample";

export default function Page() {
  return (
    <React.Suspense fallback={<></>}>
      <AuthSample />
    </React.Suspense>
  );
}
