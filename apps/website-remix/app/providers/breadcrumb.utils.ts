import type { Params } from "@remix-run/react";
import { isFunction } from "@veloss/assertion";
import { isEqual } from "ufo";

import type { BreadcrumbItem } from "./breadcrumb.types";
import { breadcrumbs } from "./breadcrumb.data";

interface BreadcrumbResult {
  title: string;
  type: BreadcrumbItem["type"];
  pathname?: string;
}

export function findBreadcrumbPathList(
  items: BreadcrumbItem[],
  targetPathname: string,
  params?: Readonly<Params<string>>,
): BreadcrumbResult[] {
  // 경로를 저장할 스택
  const stack: BreadcrumbResult[] = [];

  function search(currentItems: BreadcrumbItem[]): boolean {
    // 이진 탐색을 위해 items를 pathname 기준으로 정렬
    const sortedItems = [...currentItems].sort((a, b) => {
      const aPath = isFunction(a.pathname)
        ? a.pathname(params)
        : (a.pathname ?? "");

      const bPath = isFunction(b.pathname)
        ? b.pathname(params)
        : (b.pathname ?? "");

      return aPath.localeCompare(bPath);
    });

    for (const item of sortedItems) {
      const currentPathname = isFunction(item.pathname)
        ? item.pathname(params)
        : item.pathname;

      // 현재 아이템을 스택에 추가
      stack.push({
        title: item.title,
        type: item.type,
        pathname: currentPathname,
      });

      // 현재 아이템이 타겟과 일치하는 경우
      if (
        currentPathname &&
        isEqual(currentPathname, targetPathname, { trailingSlash: true })
      ) {
        return true;
      }

      // 자식 노드가 있는 경우 재귀적으로 검색
      if (item.children && item.children.length > 0) {
        if (search(item.children)) {
          return true;
        }
      }

      // 일치하지 않으면 스택에서 제거
      stack.pop();
    }

    return false;
  }

  search(items);
  return stack;
}

export function findBreadcrumbPath(
  items: BreadcrumbItem[],
  targetPathname: string,
  params?: Readonly<Params<string>>,
): BreadcrumbResult | undefined {
  const result = findBreadcrumbPathList(items, targetPathname, params);
  return result.at(-1);
}

export function initializeBreadcrumb(_: BreadcrumbItem[]): BreadcrumbItem[] {
  return breadcrumbs;
}
