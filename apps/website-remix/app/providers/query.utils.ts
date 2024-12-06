import type { QueryFunction, QueryKey } from "@tanstack/react-query";

import type { SearchParams } from "~/types/app";

export type GetPathFn = (
  searchParams?: SearchParams,
  pageNo?: number,
) => string;

export const getInfinityQueryPath = (
  basePath: string,
  searchParams?: SearchParams,
  pageNo?: number,
) => {
  if (searchParams) {
    const params = new URLSearchParams(searchParams);
    if (pageNo) {
      params.set("pageNo", String(pageNo));
    }
    return `${basePath}?${params.toString()}`;
  }

  if (pageNo) {
    const params = new URLSearchParams();
    params.set("pageNo", String(pageNo));
    return `${basePath}?${params.toString()}`;
  }

  return basePath;
};

export const getInfinityQueryFn = <D, Q extends QueryKey>(
  getPath: GetPathFn,
): QueryFunction<D, Q, number> => {
  return async (ctx) => {
    const lastKey = ctx.queryKey.at(-1) as SearchParams;
    const url = getPath(lastKey, ctx.pageParam);
    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: Awaited<D> = await response.json();

    return data;
  };
};
