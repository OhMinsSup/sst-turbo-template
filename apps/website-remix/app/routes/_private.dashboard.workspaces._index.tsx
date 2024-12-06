import { useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/workspaces/loaders/dashboard-workspaces_index.loader";
import { columns, DataList } from "~/components/workspaces/DataList";
import { getCustomWorkspaceEntity } from "~/components/workspaces/DataList/columns";

export { loader } from "~/.server/routes/workspaces/loaders/dashboard-workspaces_index.loader";
export { action } from "~/.server/routes/workspaces/actions/dashboard-workspaces_index.action";

export default function Routes() {
  const { pageInfo, list, totalCount } = useLoaderData<RoutesLoaderData>();

  return (
    <DataList
      list={getCustomWorkspaceEntity(list)}
      totalCount={totalCount}
      pageInfo={pageInfo}
      columns={columns}
    />
  );
}
