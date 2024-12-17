import React, { useCallback, useMemo } from "react";
import { useLoaderData } from "@remix-run/react";

import { VirtualizedMasonryGrid } from "@template/ui/virtualized-masonry-grid";

import type { RoutesLoaderDataValue } from "~/.server/routes/api/loaders/workspaces";
import type { RoutesLoaderData } from "~/.server/routes/api/loaders/workspaces.trash";
import { TrashCard } from "~/components/trash/TrashCard";
import { useInfinitWorkspaceTrashQuery } from "~/libs/queries/workspace.queries";

function transformData(page: RoutesLoaderDataValue) {
  return page.list.map((item) => ({
    ...item,
    height: 158,
    width: 490,
  }));
}

function SkeletonTrashCardList() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TrashCard.Skeleton key={`skeleton:${index}`} />
      ))}
    </>
  );
}

export default function TrashCardList() {
  const initialData = useLoaderData<RoutesLoaderData>();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isError } =
    useInfinitWorkspaceTrashQuery({
      initialData,
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

  const endReached = useCallback(async () => {
    await fetchNextPage();
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
        loadingComponent={<SkeletonTrashCardList />}
      >
        {(item) => (
          <TrashCard
            key={`trash:${item.id}`}
            item={item as unknown as RoutesLoaderDataValue["list"][0]}
          />
        )}
      </VirtualizedMasonryGrid>
    </>
  );
}
