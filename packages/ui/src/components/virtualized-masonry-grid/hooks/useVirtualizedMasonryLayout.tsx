import { useCallback, useEffect, useRef } from "react";
import { isFunction, isNumber } from "@veloss/assertion";

import type { BasicTarget } from "../../../lib";
import type { GridColumnsConfig, Viewport } from "../context/masonry";
import { useDebounceFn, useEventListener } from "../../../hooks";
import { useVirtualGridMasonryProvider } from "../context/masonry";
import { getColumns } from "../utils/colums";

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
  const { changePositions, changeContainerHeight, positions, containerHeight } =
    useVirtualGridMasonryProvider();

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
    const columnHeights = Array(columnsCount).fill(0) as number[];

    const calculatedPositions: GridItemPosition[] = items.map((item) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      const translateX = shortestColumn * (columnWidth + gap);
      const translateY = columnHeights[shortestColumn] ?? 0;

      const aspectRatio = item.height / item.width;
      const itemHeight = columnWidth * aspectRatio;
      const itemWidth = columnWidth;

      if (typeof columnHeights[shortestColumn] !== "undefined") {
        columnHeights[shortestColumn] += itemHeight + gap;
      }

      return {
        translateX,
        translateY,
        width: itemWidth,
        height: itemHeight,
      };
    });

    const newContainerHeight = Math.max(...columnHeights);

    changeContainerHeight(newContainerHeight);
    changePositions(calculatedPositions);
  }, [
    getElement,
    columns,
    breakpoints,
    gap,
    items,
    changeContainerHeight,
    changePositions,
  ]);

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
