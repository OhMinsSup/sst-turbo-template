import { useCallback, useMemo } from "react";
import { useLoaderData, useSearchParams } from "@remix-run/react";

import { VirtualizedMasonryGrid } from "@template/ui/virtualized-masonry-grid";

import type { RoutesLoaderDataValue } from "~/.server/routes/api/loaders/workspaces";
import type { RoutesLoaderData } from "~/.server/routes/workspaces/loaders/dashboard._dashboard._index.loader";
import { WorkspaceCard } from "~/components/dashboard/WorkspaceCard";
import { useInfinitWorkspaceQuery } from "~/libs/queries/workspace.queries";

function transformData(page: RoutesLoaderDataValue) {
  return page.list.map((item) => ({
    ...item,
    height: 158,
    width: 490,
  }));
}

function SkeletonWorkspaceCardList() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <WorkspaceCard.Skeleton key={`skeleton:${index}`} />
      ))}
    </>
  );
}

export default function WorkspaceCardList() {
  const initialData = useLoaderData<RoutesLoaderData>();
  const [searchParams] = useSearchParams();

  const searchParamsObj = useMemo(() => {
    const _searchParams = new URLSearchParams(searchParams);
    return Object.fromEntries(_searchParams.entries());
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isError } =
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

  const hasMore = useMemo(
    () => totalFetched < totalDBRowCount && hasNextPage && !isFetchingNextPage,
    [totalFetched, totalDBRowCount, hasNextPage, isFetchingNextPage],
  );

  const endReached = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <VirtualizedMasonryGrid
        items={flatData}
        hasNextPage={hasMore}
        endReached={endReached}
        loadingComponent={<SkeletonWorkspaceCardList />}
      >
        {(item) => (
          <WorkspaceCard
            key={`workspace:${item.id}`}
            item={item as unknown as RoutesLoaderDataValue["list"][0]}
          />
        )}
      </VirtualizedMasonryGrid>
    </>
  );
}
