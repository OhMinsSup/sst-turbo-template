import { useMemo } from "react";
import { useLoaderData } from "@remix-run/react";

import type { RoutesLoaderDataValue } from "~/.server/routes/api/loaders/workspaces";
import type { RoutesLoaderData } from "~/.server/routes/workspaces/loaders/dashboard._dashboard._index.loader";
import { WorkspaceCard } from "~/components/dashboard/WorkspaceCard";
import { useInfinitWorkspaceQuery } from "~/libs/queries/workspace.queries";
import VirtualizedMasonryGrid from "./VirtualizedMasonryGrid";

function transformData(page: RoutesLoaderDataValue) {
  return page.list.map((item) => ({
    ...item,
    height: 140,
    width: 475,
  }));
}

export default function WorkspaceCardList_Test() {
  const initialData = useLoaderData<RoutesLoaderData>();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitWorkspaceQuery({
      initialData,
    });

  // flatten the array of arrays from the useInfiniteQuery hook
  const flatData = useMemo(() => data.pages.flatMap(transformData), [data]);
  const totalDBRowCount = data.pages.at(0)?.totalCount ?? 0;
  const totalFetched = flatData.length;

  return (
    <VirtualizedMasonryGrid
      items={flatData}
      hasNextPage={
        totalFetched < totalDBRowCount && hasNextPage && !isFetchingNextPage
      }
      endReached={() => fetchNextPage()}
    >
      {(item) => (
        <WorkspaceCard
          key={`workspace:${item.id}`}
          item={item as unknown as RoutesLoaderDataValue["list"][0]}
        />
      )}
    </VirtualizedMasonryGrid>
  );
}
