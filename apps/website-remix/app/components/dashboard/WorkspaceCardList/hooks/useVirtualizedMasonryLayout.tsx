// useVirtualizedMasonryLayout.tsx
import { useCallback, useEffect, useRef, useState } from "react";

import type { BasicTarget } from "@template/ui/lib";
import { useDebounceFn, useEventListener } from "@template/ui/hooks";
import { isFunction, isNumber } from "@template/utils/assertion";

import type { GridColumnsConfig, Viewport } from "../context/masonry";
import { getColumns } from "../utils/colums";
import { arePositionsEqual } from "../utils/helper";

export type TargetType = HTMLElement | Element;

export interface GridItem {
  id: string | number;
  height: number;
  width: number;
  [key: string]: unknown;
}

export interface GridItemPosition {
  translateX: number;
  translateY: number;
  width: number;
  height: number;
}

function isElement(target: unknown): target is HTMLElement {
  return target instanceof Element || target instanceof HTMLElement;
}

interface UseVirtualizedMasonryLayoutParams<T extends TargetType> {
  items: GridItem[];
  columns: number | GridColumnsConfig;
  gap: number;
  getElement: BasicTarget<T> | (() => BasicTarget<T>);
  breakpoints: Viewport["breakpoints"];
}

export function useVirtualizedMasonryLayout<T extends TargetType>({
  items,
  columns,
  gap,
  getElement,
  breakpoints,
}: UseVirtualizedMasonryLayoutParams<T>) {
  const [positions, setPositions] = useState<GridItemPosition[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const isMounted = useRef(false);

  const updateLayout = useCallback(() => {
    const target = isFunction(getElement) ? getElement() : getElement;

    if (!target) {
      return;
    }

    const columnsCount = isNumber(columns)
      ? columns
      : getColumns(columns, breakpoints);

    const containerWidth = isElement(target) ? target.offsetWidth : 0;
    const columnWidth =
      (containerWidth - gap * (columnsCount - 1)) / columnsCount;
    const columnHeights = Array(columnsCount).fill(0);

    const calculatedPositions = items.map((item) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      const translateX = shortestColumn * (columnWidth + gap);
      const translateY = columnHeights[shortestColumn];

      const aspectRatio = item.height / item.width;
      const itemHeight = columnWidth * aspectRatio;
      const itemWidth = columnWidth;

      columnHeights[shortestColumn] += itemHeight + gap;

      return {
        translateX,
        translateY,
        width: itemWidth,
        height: itemHeight,
      };
    });

    const newContainerHeight = Math.max(...columnHeights);

    // 상태 업데이트 전에 이전 상태와 비교
    setPositions((prevPositions) => {
      if (!arePositionsEqual(prevPositions, calculatedPositions)) {
        return calculatedPositions;
      }
      return prevPositions;
    });

    setContainerHeight((prevHeight) => {
      if (prevHeight !== newContainerHeight) {
        return newContainerHeight;
      }
      return prevHeight;
    });
  }, [breakpoints, columns, gap, items, getElement]);

  // useDebounceFn의 결과를 useMemo로 메모이제이션
  const debounce = useDebounceFn(updateLayout, {
    wait: 200,
    leading: false,
    trailing: true,
  });

  // resize 이벤트에 디바운스된 핸들러 등록
  useEventListener("resize", debounce.run);

  useEffect(() => {
    if (isMounted.current) {
      updateLayout();
    } else {
      isMounted.current = true;
    }
  }, [updateLayout]);

  return { positions, containerHeight };
}
