import type { LoaderFunctionArgs } from "@remix-run/node";
import { invariant } from "@epic-web/invariant";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const workspaceId = params.workspaceId;
  invariant(workspaceId, "workspaceId is required");
  return {
    workspaceId,
  };
};

export type RoutesLoaderData = typeof loader;
