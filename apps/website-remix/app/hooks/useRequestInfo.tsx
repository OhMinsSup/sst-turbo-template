import { useRouteLoaderData } from "@remix-run/react";
import { invariant } from "@epic-web/invariant";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";

export function useRequestInfo() {
  const data = useRouteLoaderData<RoutesLoaderData>("root");
  invariant(
    data?.requestInfo,
    "useRequestInfo must be used within a route loader",
  );
  return data.requestInfo;
}
