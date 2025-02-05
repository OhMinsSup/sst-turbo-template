import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { ScrollArea } from "@template/ui/components/scroll-area";
import { useEventListener, useThrottleFn } from "@template/ui/hooks";

import type { RoutesLoaderDataValue } from "~/.server/api/loaders/workspaces.loader";
import { TrashItem } from "./TrashItem";

interface TrashItemListTypeDashboardProps {
  deferredQuery: string;
}

export function TrashItemListTypeDashboard({
  deferredQuery,
}: TrashItemListTypeDashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);
  const currentPage = useRef(1);

  const fetcher = useFetcher<RoutesLoaderDataValue>();
  const [data, setData] = useState<Record<string, RoutesLoaderDataValue>>({});

  const throttle = useThrottleFn(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const element = e.target as HTMLDivElement;

      const isBottom =
        element.scrollHeight - element.scrollTop === element.clientHeight;

      const target = data[currentPage.current] as
        | RoutesLoaderDataValue
        | undefined;

      const hasMore = target?.pageInfo.hasNextPage;

      if (isBottom && hasMore) {
        currentPage.current += 1;
        let apiPath = `/api/workspaces/trash?pageNo=${currentPage.current}&limit=10`;
        if (deferredQuery) {
          apiPath += `&title=${deferredQuery}`;
        }
        fetcher.load(apiPath);
      }
    },
    {
      wait: 300,
    },
  );

  useEventListener("scroll", throttle.run, {
    target: ref,
    capture: true,
  });

  useEffect(() => {
    if (!isMounted.current) {
      currentPage.current = 1;
      let apiPath = "/api/workspaces/trash?pageNo=1&limit=10";
      if (deferredQuery) {
        apiPath += `&title=${deferredQuery}`;
      }
      fetcher.load(apiPath);
      isMounted.current = true;
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    if (fetcher.data) {
      const nextData = fetcher.data;
      if (!ignore) {
        setData((prev) => {
          return {
            ...prev,
            [nextData.pageInfo.currentPage.toString()]: nextData,
          };
        });
      }
    }

    return () => {
      ignore = true;
    };
  }, [fetcher.data]);

  const flatList = useMemo(() => {
    const values = Object.values(data);
    return values.flatMap((item) => item.list);
  }, [data]);

  return (
    <ScrollArea type="auto" ref={ref}>
      {flatList.map((item) => (
        <TrashItem key={`trash:${item.id}`} item={item} />
      ))}
    </ScrollArea>
  );
}
