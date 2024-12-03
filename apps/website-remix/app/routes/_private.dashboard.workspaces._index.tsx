import { useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/workspaces/dashboard-workspaces_index.loader";
import { columns, DataList } from "~/components/workspaces/DataList";

export { loader } from "~/.server/routes/workspaces/dashboard-workspaces_index.loader";

export default function Routes() {
  const { pageInfo, list, totalCount } = useLoaderData<RoutesLoaderData>();

  return (
    <DataList
      data={list}
      totalCount={totalCount}
      pageInfo={pageInfo}
      columns={columns}
    />
  );
}
