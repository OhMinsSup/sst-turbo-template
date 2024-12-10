import React, { useEffect, useRef } from "react";

import { useIntersectionObserver } from "@template/ui/hooks";
import { getTargetElement } from "@template/ui/lib";
import { isFunction } from "@template/utils/assertion";

import type { GridColumnsConfig } from "./context/masonry";
import type { GridItem } from "./hooks/useVirtualizedMasonryLayout";
import { useVirtualGridMasonryProvider } from "./context/masonry";
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
}

function VirtualizedMasonryGrid<T extends GridItem>({
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
}: VirtualizedMasonryGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { viewport } = useVirtualGridMasonryProvider();

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
          const pos = positions[index];
          const item = items[index];
          return (
            <div
              role="listitem"
              key={`${item.id}-${index}`}
              className="absolute left-0 top-0"
              style={{
                transform: `translateX(${pos.translateX}px) translateY(${pos.translateY}px)`,
                width: pos.width,
                height: pos.height,
              }}
            >
              {isFunction(children) ? children(item, index) : children}
            </div>
          );
        })}
      </div>
      {hasNextPage && containerHeight > 0 ? (
        <div ref={loaderRef} className="h-16 w-full">
          Loading...
        </div>
      ) : null}
    </>
  );
}

export default React.memo(VirtualizedMasonryGrid);
