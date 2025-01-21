/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { LoadMoreItemsCallback, RenderComponentProps } from "masonic";
import React, { useCallback, useMemo } from "react";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { Masonry, useInfiniteLoader } from "masonic";

import type { RoutesLoaderDataValue } from "~/.server/api/loaders/workspaces.loader";
import type { RoutesLoaderData } from "~/.server/loaders/_private._dashboard.dashboard._index.loader";
import { DashboardCard } from "~/components/dashboard/DashboardCard";
import { Icons } from "~/components/icons";
import { useInfinitWorkspaceQuery } from "~/libs/queries/workspace.queries";

type Item = RoutesLoaderDataValue["list"][0];

const MasonryCard: React.ComponentType<RenderComponentProps<Item>> = React.memo(
  ({ data, width }) => {
    const style = useMemo(() => {
      return {
        width,
      } as React.CSSProperties;
    }, [width]);
    return <DashboardCard style={style} item={data} />;
  },
);

interface DashboardCardListProps {
  favorite?: boolean;
}

export default function DashboardCardList({
  favorite,
}: DashboardCardListProps) {
  const initialData = useLoaderData<RoutesLoaderData>();

  const [searchParams] = useSearchParams();

  const query = useMemo(() => {
    const defaultQuery = {
      favorite: favorite ? "true" : undefined,
    };
    const nextQuery = Object.fromEntries(
      new URLSearchParams(searchParams).entries(),
    );
    return {
      ...defaultQuery,
      ...nextQuery,
    } as Record<string, string>;
  }, [searchParams, favorite]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isStale,
  } = useInfinitWorkspaceQuery({
    initialData,
    query,
  });

  const flatItems = useMemo(
    () => data.pages.flatMap((page) => page.list.map((item) => item)) ?? [],
    [data],
  );

  const totalDBRowCount = useMemo(
    () => data.pages.at(0)?.totalCount ?? 0,
    [data],
  );
  const totalFetched = useMemo(() => flatItems.length, [flatItems]);

  const hasMore = useMemo(
    () => totalFetched < totalDBRowCount && hasNextPage && !isFetchingNextPage,
    [totalFetched, totalDBRowCount, hasNextPage, isFetchingNextPage],
  );

  const fetchNextPageIfPossible = useCallback(
    async <Item,>(_: number, __: number, ___: Item[]) => {
      if (hasMore) {
        await fetchNextPage();
      }
    },
    [fetchNextPage, hasMore],
  );

  const maybeLoadMore = useInfiniteLoader<Item, LoadMoreItemsCallback<Item>>(
    fetchNextPageIfPossible,
    {
      isItemLoaded: (index, items) => {
        return !!items.at(index);
      },
    },
  );

  if (isStale) {
    return null;
  }

  if (isError) {
    return null;
  }

  return (
    <Masonry
      items={flatItems}
      columnGutter={12}
      columnWidth={400}
      overscanBy={5}
      maxColumnCount={3}
      onRender={maybeLoadMore}
      render={MasonryCard}
    />
  );
}

DashboardCardList.Loading = function () {
  return (
    <div className="flex size-full items-center justify-center">
      <Icons.Spinner className="mx-auto h-8 w-8 animate-spin" />
    </div>
  );
};
