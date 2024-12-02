import { useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/dashboard/dashboard_index.loader";
import { DashboardList } from "~/components/dashboard/DashboardList";
import { columns } from "~/components/dashboard/DashboardList/columns";

export { loader } from "~/.server/routes/dashboard/dashboard_index.loader";

export default function Routes() {
  const { pageInfo, list, totalCount } = useLoaderData<RoutesLoaderData>();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">워크스페이스</h2>
          <p className="text-muted-foreground">
            워크스페이스의 모든 것을 관리하세요.
          </p>
        </div>
      </div>
      <DashboardList
        data={list}
        totalCount={totalCount}
        pageInfo={pageInfo}
        columns={columns}
      />
    </div>
  );
}
