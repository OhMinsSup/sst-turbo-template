import type {
  BreakpointKey,
  GridColumnsConfig,
  Viewport,
} from "../context/masonry";

export const DEFAULT_COLUMNS = 3;

const getInheritedColumns = (
  columns: GridColumnsConfig,
  fallback: number,
): GridColumnsConfig => {
  const inheritedColumns: GridColumnsConfig = {};
  const breakpointsOrder: BreakpointKey[] = [
    "mobile",
    "tablet",
    "laptop",
    "desktop",
    "largeScreen",
  ];

  // 좌우 최적 값 미리 계산:
  // 왼쪽에서부터 각 브레이크포인트를 순회하며, 정의된 columns 값이 있으면 lastDefined를 업데이트합니다. 이를 통해 각 브레이크포인트에 가장 가까운 왼쪽 브레이크포인트 값을 찾습니다.
  // 오른쪽에서부터 각 브레이크포인트를 역순으로 순회하며, 정의된 columns 값이 있으면 nextDefined를 업데이트합니다. 이를 통해 각 브레이크포인트에 가장 가까운 오른쪽 브레이크포인트 값을 찾습니다.

  // 왼쪽에서부터 가장 가까운 정의된 값 찾기
  const leftClosest: Partial<GridColumnsConfig> = {};
  let lastDefined: number | undefined = undefined;

  for (const breakpoint of breakpointsOrder) {
    if (columns[breakpoint] !== undefined) {
      lastDefined = columns[breakpoint];
    }
    leftClosest[breakpoint] = lastDefined;
  }

  // 오른쪽에서부터 가장 가까운 정의된 값 찾기
  const rightClosest: Partial<GridColumnsConfig> = {};
  let nextDefined: number | undefined = undefined;

  for (let i = breakpointsOrder.length - 1; i >= 0; i--) {
    const breakpoint = breakpointsOrder[i];
    if (columns[breakpoint] !== undefined) {
      nextDefined = columns[breakpoint];
    }
    rightClosest[breakpoint] = nextDefined;
  }

  // 상속된 컬럼 설정
  for (const breakpoint of breakpointsOrder) {
    inheritedColumns[breakpoint] =
      columns[breakpoint] ??
      leftClosest[breakpoint] ??
      rightClosest[breakpoint] ??
      fallback;
  }

  return inheritedColumns;
};

export const getColumns = (
  columns: GridColumnsConfig,
  breakpoints: Viewport["breakpoints"],
): number => {
  const inheritedColumns = getInheritedColumns(columns, DEFAULT_COLUMNS);
  const width = window.innerWidth;

  // 브레이크포인트를 내림차순으로 정렬된 배열로 정의
  const orderedBreakpoints: [BreakpointKey, number][] = [
    ["largeScreen", breakpoints.largeScreen],
    ["desktop", breakpoints.desktop],
    ["laptop", breakpoints.laptop],
    ["tablet", breakpoints.tablet],
    ["mobile", breakpoints.mobile],
  ];

  for (const [breakpoint, minWidth] of orderedBreakpoints) {
    if (width >= minWidth) {
      return inheritedColumns[breakpoint] ?? DEFAULT_COLUMNS;
    }
  }

  return DEFAULT_COLUMNS; // 기본값 반환
};
