import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "@remix-run/react";

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
  const [searchParams] = useSearchParams();

  const searchParamsObj = useMemo(() => {
    const _searchParams = new URLSearchParams(searchParams);
    return Object.fromEntries(_searchParams.entries());
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitWorkspaceQuery({
      initialData,
      query: searchParamsObj,
    });

  const flatData = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    () => data.pages?.flatMap(transformData) ?? [],
    [data],
  );
  const totalDBRowCount = data.pages.at(0)?.totalCount ?? 0;
  const totalFetched = flatData.length;

  console.log(flatData);

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
