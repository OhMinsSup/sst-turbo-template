import { useRouteLoaderData } from "@remix-run/react";
import { invariant } from "@epic-web/invariant";

import type {
  RequestInfo,
  RoutesLoaderData,
} from "~/.server/routes/root/loaders/root.loader";

export function useRequestInfo(): RequestInfo {
  const data = useRouteLoaderData<RoutesLoaderData>("root");
  invariant(
    data?.requestInfo,
    "useRequestInfo must be used within a route loader",
  );
  return data.requestInfo as RequestInfo;
}
