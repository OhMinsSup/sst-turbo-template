import type { SerializeFrom } from "@remix-run/node";
import { useAsyncValue } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/workspaces/dashboard-workspaces.loader";
import { SidebarMenuItems } from "~/components/workspaces/SidebarMenuItems";

export default function SidebarWorkspace() {
  const value = useAsyncValue() as Awaited<SerializeFrom<RoutesLoaderData>>;
  const { workspaces } = value;
  return <SidebarMenuItems initialData={workspaces} />;
}
