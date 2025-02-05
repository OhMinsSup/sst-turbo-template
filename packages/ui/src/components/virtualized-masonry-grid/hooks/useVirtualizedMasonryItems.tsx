import { useCallback, useEffect, useMemo, useRef } from "react";
import { isFunction } from "@veloss/assertion";

import type { BasicTarget } from "../../../lib";
import type {
  GridItemPosition,
  TargetType,
} from "./useVirtualizedMasonryLayout";
import { useEventListener, useThrottleFn } from "../../../hooks";
import { useVirtualGridMasonryProvider } from "../context/masonry";

interface UseVirtualizedMasonryItemsParams<T extends TargetType> {
  positions: GridItemPosition[];
  getElement: BasicTarget<T> | (() => BasicTarget<T>);
  overscan: number;
  gap: number;
  itemsLength: number;
}

export function useVirtualizedMasonryItems<T extends TargetType>({
  positions,
  getElement,
  overscan,
  gap,
  itemsLength,
}: UseVirtualizedMasonryItemsParams<T>) {
  const { visibleItems, changeVisibleItems } = useVirtualGridMasonryProvider();

  const isMounted = useRef(false);

  // positions를 translateY 기준으로 정렬된 배열로 메모이제이션
  const sortedPositionsWithIndex = useMemo(() => {
    return positions
      .map((pos, index) => ({
        index,
        translateY: pos.translateY,
        height: pos.height,
      }))
      .sort((a, b) => a.translateY - b.translateY);
  }, [positions]);

  const updateVisibleItems = useCallback(() => {
    if (sortedPositionsWithIndex.length === 0) {
      if (visibleItems.length > 0) {
        changeVisibleItems([]);
      }
      return;
    }

    const target = isFunction(getElement) ? getElement() : getElement;
    if (!target) {
      return;
    }

    const scrollTop = (target as HTMLElement).scrollTop;
    const containerHeightView = (target as HTMLElement).clientHeight;

    const start = scrollTop;
    const end = scrollTop + containerHeightView;

    const viewportIndices: number[] = [];

    // 이진 탐색을 통해 첫 번째로 보이는 아이템 찾기
    let left = 0;
    let right = sortedPositionsWithIndex.length - 1;
    let firstVisible = sortedPositionsWithIndex.length;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const item = sortedPositionsWithIndex[mid];
      const itemBottom = (item?.translateY ?? 0) + (item?.height ?? 0);

      if (itemBottom + gap >= start) {
        firstVisible = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // 이진 탐색을 통해 마지막으로 보이는 아이템 찾기
    left = 0;
    right = sortedPositionsWithIndex.length - 1;
    let lastVisible = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const itemTop = sortedPositionsWithIndex[mid]?.translateY ?? 0;

      if (itemTop - gap <= end) {
        lastVisible = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // 보이는 아이템의 인덱스 수집
    if (firstVisible <= lastVisible) {
      const indices = sortedPositionsWithIndex
        .slice(firstVisible, lastVisible + 1)
        .map((item) => item.index);
      viewportIndices.push(...indices);
    }

    if (viewportIndices.length === 0) {
      if (visibleItems.length > 0) {
        changeVisibleItems([]);
      }
      return;
    }

    const minIndex = Math.min(...viewportIndices);
    const maxIndex = Math.max(...viewportIndices);

    const startIndex = Math.max(0, minIndex - overscan);
    const endIndex = Math.min(itemsLength - 1, maxIndex + overscan);

    const newVisibleItems = Array.from(
      { length: endIndex - startIndex + 1 },
      (_, i) => startIndex + i,
    );

    changeVisibleItems(newVisibleItems);
  }, [
    sortedPositionsWithIndex,
    getElement,
    overscan,
    itemsLength,
    changeVisibleItems,
    visibleItems.length,
    gap,
  ]);

  const throttle = useThrottleFn(updateVisibleItems, {
    wait: 100,
  });

  useEventListener("scroll", throttle.run);

  useEffect(() => {
    if (isMounted.current) {
      updateVisibleItems();
    } else {
      isMounted.current = true;
    }
  }, [updateVisibleItems]);

  return visibleItems;
}
