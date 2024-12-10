import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { BasicTarget } from "@template/ui/lib";
import { useEventListener, useThrottleFn } from "@template/ui/hooks";
import { isFunction } from "@template/utils/assertion";

import type {
  GridItemPosition,
  TargetType,
} from "./useVirtualizedMasonryLayout";

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
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
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
        setVisibleItems([]);
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
      const itemBottom = item.translateY + item.height;

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
      const itemTop = sortedPositionsWithIndex[mid].translateY;

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
        setVisibleItems([]);
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

    // 상태 업데이트 전에 이전 상태와 비교
    setVisibleItems((prevVisibleItems) => {
      if (
        prevVisibleItems.length !== newVisibleItems.length ||
        !prevVisibleItems.every((v, i) => v === newVisibleItems[i])
      ) {
        return newVisibleItems;
      }
      return prevVisibleItems;
    });
  }, [
    sortedPositionsWithIndex,
    gap,
    overscan,
    getElement,
    itemsLength,
    visibleItems.length,
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
