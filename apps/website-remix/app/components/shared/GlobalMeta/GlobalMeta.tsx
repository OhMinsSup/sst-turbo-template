import { useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/loaders/root.loader";

export default function GlobalMeta() {
  const data = useLoaderData<RoutesLoaderData>();

  return (
    <>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,viewport-fit=cover"
      />
      <meta name="theme-color" content="#ffffff" />
      <link rel="canonical" href={data.requestInfo.origin} />
    </>
  );
}
