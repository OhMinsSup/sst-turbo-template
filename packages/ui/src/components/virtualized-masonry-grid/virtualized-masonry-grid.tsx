import React, { useEffect, useRef } from "react";
import { isFunction } from "@veloss/assertion";

import type { GridColumnsConfig } from "./context/masonry";
import type { GridItem } from "./hooks/useVirtualizedMasonryLayout";
import { useIntersectionObserver } from "../../hooks";
import { getTargetElement } from "../../lib";
import { LoaderCircle } from "../shadcn/icons";
import {
  useVirtualGridMasonryProvider,
  VirtualGridMasonryProvider,
} from "./context/masonry";
import { useVirtualizedMasonryItems } from "./hooks/useVirtualizedMasonryItems";
import { useVirtualizedMasonryLayout } from "./hooks/useVirtualizedMasonryLayout";

interface VirtualizedMasonryGridProps<T extends GridItem> {
  items: T[];
  columns?: GridColumnsConfig | number;
  gap?: number;
  overscan?: number;
  hasNextPage?: boolean;
  endReached?: (index: number) => void;
  children: ((item: T, index: number) => React.ReactNode) | React.ReactNode;
  loadingComponent?: React.ReactNode;
}

function InternalVirtualizedMasonryGrid<T extends GridItem>({
  items,
  columns = {
    tablet: 1,
    laptop: 2,
    desktop: 2,
    largeScreen: 3,
  },
  gap = 8,
  endReached,
  overscan = 8,
  children,
  hasNextPage,
  loadingComponent,
}: VirtualizedMasonryGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { viewport, setFristRender, fristRender } =
    useVirtualGridMasonryProvider();
  const isFristRenderRef = useRef(false);

  const { positions, containerHeight } = useVirtualizedMasonryLayout({
    items,
    columns,
    gap,
    getElement: () => getTargetElement(containerRef),
    breakpoints: viewport.breakpoints,
  });

  const visibleItems = useVirtualizedMasonryItems({
    positions,
    getElement: () => getTargetElement(containerRef),
    overscan,
    gap,
    itemsLength: items.length,
  });

  const intersectionObserverCallback: IntersectionObserverCallback = (
    entries,
  ) => {
    if (!endReached || !hasNextPage || containerHeight === 0) return;

    const entrie = entries.at(0);
    if (entrie?.isIntersecting) {
      endReached(items.length ? items.length - 1 : 0);
    }
  };

  useIntersectionObserver(intersectionObserverCallback, loaderRef, {
    threshold: 0,
  });

  useEffect(() => {
    if (!isFristRenderRef.current && containerHeight > 0 && !fristRender) {
      isFristRenderRef.current = true;
      setFristRender(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerHeight, fristRender]);

  return (
    <>
      <div
        ref={containerRef}
        role="list"
        className="relative w-full"
        style={{
          height: containerHeight,
        }}
      >
        {visibleItems.map((index) => {
          const pos = positions.at(index);
          const item = items.at(index);

          if (!item) {
            return null;
          }

          return (
            <div
              role="listitem"
              key={`${item.id}-${index}`}
              className="absolute left-0 top-0"
              style={{
                transform: `translateX(${pos?.translateX}px) translateY(${pos?.translateY}px)`,
                width: pos?.width,
                height: pos?.height,
              }}
            >
              {isFunction(children) ? children(item, index) : children}
            </div>
          );
        })}
      </div>
      {hasNextPage && containerHeight > 0 ? (
        <div ref={loaderRef}>{loadingComponent}</div>
      ) : null}
      {fristRender ? null : <>{loadingComponent}</>}
    </>
  );
}

function VirtualizedMasonryGrid<T extends GridItem>({
  items,
  columns = {
    tablet: 1,
    laptop: 2,
    desktop: 2,
    largeScreen: 3,
  },
  gap = 32,
  endReached,
  overscan = 8,
  children,
  hasNextPage,
  loadingComponent = (
    <div className="h-20 w-full">
      <LoaderCircle className="mx-auto h-8 w-8 animate-spin" />
    </div>
  ),
}: VirtualizedMasonryGridProps<T>) {
  return (
    <VirtualGridMasonryProvider>
      <InternalVirtualizedMasonryGrid<T>
        items={items}
        columns={columns}
        gap={gap}
        overscan={overscan}
        endReached={endReached}
        children={children}
        hasNextPage={hasNextPage}
        loadingComponent={loadingComponent}
      />
    </VirtualGridMasonryProvider>
  );
}

export default VirtualizedMasonryGrid;
