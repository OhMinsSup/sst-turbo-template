import { useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/workspaces/dashboard-workspaces.loader";
import { SidebarMenuItems } from "~/components/workspaces/SidebarMenuItems";

export default function SidebarWorkspace() {
  const { list } = useLoaderData<RoutesLoaderData>();
  return <SidebarMenuItems initialData={list} />;
}
