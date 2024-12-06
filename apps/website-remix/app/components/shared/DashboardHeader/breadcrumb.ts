import type { Params } from "@remix-run/react";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export interface BaseBreadcrumbItem {
  title: string;
  isLast: boolean;
  description?: string;
  pathname: string | ((params?: Readonly<Params<string>>) => string);
  pathnameRegex?: RegExp | ((params?: Readonly<Params<string>>) => RegExp);
  children?: BaseBreadcrumbItem[];
}

const breadcrumb = new Map<RegExp, BaseBreadcrumbItem[]>([
  [
    /^\/dashboard\/?$/,
    [
      {
        title: "대시보드",
        isLast: true,
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
        pathnameRegex: /^\/dashboard\/?$/,
      },
    ],
  ],
  [
    /^\/dashboard\/workspaces\/?$/,
    [
      {
        title: "대시보드",
        isLast: false,
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
        pathnameRegex: /^\/dashboard\/?$/,
        children: [
          {
            title: "워크스페이스",
            description: "워크스페이스의 모든 것을 관리하세요.",
            isLast: true,
            pathname: PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ROOT,
            pathnameRegex: /^\/dashboard\/workspaces\/?$/,
          },
        ],
      },
    ],
  ],
]);

interface GetBreadcrumbParams {
  pathname: string;
  params?: Readonly<Params<string>>;
}

function recursiveMatch(
  items: BaseBreadcrumbItem[],
  pathname: string,
  params?: Readonly<Params<string>>,
): BaseBreadcrumbItem[] {
  for (const item of items) {
    if (typeof item.pathnameRegex === "function") {
      if (item.pathnameRegex(params).test(pathname)) {
        if (item.children) {
          return recursiveMatch(item.children, pathname);
        }

        return [item];
      }
    } else if (item.pathnameRegex?.test(pathname)) {
      if (item.children) {
        return recursiveMatch(item.children, pathname);
      }

      return [item];
    } else if (typeof item.pathname === "function") {
      if (item.pathname(params) === pathname) {
        if (item.children) {
          return recursiveMatch(item.children, pathname);
        }
        return [item];
      }
    } else if (item.pathname === pathname) {
      if (item.children) {
        return recursiveMatch(item.children, pathname);
      }
      return [item];
    }
  }

  return [];
}

export function getBreadcrumbs({
  pathname,
  params,
}: GetBreadcrumbParams): BaseBreadcrumbItem[] {
  for (const [regex, items] of breadcrumb) {
    if (regex.test(pathname)) {
      return recursiveMatch(items, pathname, params);
    }
  }

  return [];
}

export function getBreadcrumb({ pathname, params }: GetBreadcrumbParams) {
  const items = getBreadcrumbs({ pathname, params });
  return items.at(-1);
}
