import type { DefaultError, InfiniteData } from "@tanstack/react-query";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import type { RoutesLoaderData } from "~/.server/routes/api/loaders/workspaces";
import type { Query as QueryParams } from "~/.server/routes/workspaces/dto/workspace-list-query.dto";
import type { SearchParams } from "~/types/app";
import {
  getInfinityQueryFn,
  getInfinityQueryPath,
} from "~/providers/query.utils";

type FnData = RoutesLoaderData;

type ListKeys = ReturnType<typeof queryWorkspaceKeys.list>;

type TrashListKeys = ReturnType<typeof queryWorkspaceKeys.trash>;

type Data = InfiniteData<FnData>;

export const queryWorkspaceKeys = {
  all: ["workspaces"] as const,
  list: (query?: QueryParams) => ["workspaces", "list", query] as const,
  trash: () => ["workspaces", "trash"] as const,
};

interface UseWorkspaceQueryParams {
  query?: QueryParams;
  initialData?: RoutesLoaderData;
}

export function useInfinitWorkspaceQuery(params?: UseWorkspaceQueryParams) {
  const getPath = (searchParams?: SearchParams, pageNo?: number) => {
    return getInfinityQueryPath("/api/workspaces", searchParams, pageNo);
  };
  return useInfiniteQuery<FnData, DefaultError, Data, ListKeys, number>({
    queryKey: queryWorkspaceKeys.list(params?.query),
    queryFn: getInfinityQueryFn(getPath),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.pageInfo;
      if (pageInfo.hasNextPage) {
        return pageInfo.nextPage ?? undefined;
      }
      return undefined;
    },
    // @ts-expect-error - This is a bug in react-query types
    initialData: params?.initialData
      ? () => ({ pageParams: [undefined], pages: [params.initialData] })
      : undefined,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function useInfinitWorkspaceTrashQuery() {
  const getPath = (searchParams?: SearchParams, pageNo?: number) => {
    return getInfinityQueryPath("/api/workspaces/trash", searchParams, pageNo);
  };
  return useInfiniteQuery<FnData, DefaultError, Data, TrashListKeys, number>({
    queryKey: queryWorkspaceKeys.trash(),
    queryFn: getInfinityQueryFn(getPath),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.pageInfo;
      if (pageInfo.hasNextPage) {
        return pageInfo.nextPage ?? undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}
