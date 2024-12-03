import { useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/workspaces/dashboard-workspaces_index.loader";
import { DashboardList } from "~/components/dashboard/DashboardList";
import { columns } from "~/components/dashboard/DashboardList/columns";

export { loader } from "~/.server/routes/workspaces/dashboard-workspaces_index.loader";

export default function Routes() {
  const { pageInfo, list, totalCount } = useLoaderData<RoutesLoaderData>();

  return (
    <DashboardList
      data={list}
      totalCount={totalCount}
      pageInfo={pageInfo}
      columns={columns}
    />
  );
}
