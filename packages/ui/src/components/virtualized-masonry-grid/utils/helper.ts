import type { GridItemPosition } from "../hooks/useVirtualizedMasonryLayout";

export const arePositionsEqual = (
  prevPositions: GridItemPosition[],
  newPositions: GridItemPosition[],
): boolean => {
  if (prevPositions.length !== newPositions.length) return false;
  for (let i = 0; i < prevPositions.length; i++) {
    const prev = prevPositions[i];
    const newPos = newPositions[i];
    if (
      prev?.translateX !== newPos?.translateX ||
      prev?.translateY !== newPos?.translateY ||
      prev?.width !== newPos?.width ||
      prev?.height !== newPos?.height
    ) {
      return false;
    }
  }
  return true;
};
