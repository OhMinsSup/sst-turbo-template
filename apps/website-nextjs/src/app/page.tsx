import React from "react";

import { AuthSample } from "~/components/shared/AuthSample";
import { createClient } from "~/libs/auth/server";

export default async function Page() {
  const client = createClient();
  const { session } = await client.getSession();
  console.log(session);
  return <AuthSample />;
}
