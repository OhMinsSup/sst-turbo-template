import type { Params } from "@remix-run/react";

import { isFunction } from "@template/utils/assertion";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export interface BaseBreadcrumbItem {
  title: string;
  isLast: boolean;
  description?: string;
  pathname: string | ((params?: Readonly<Params<string>>) => string);
  pathnameRegex?: RegExp | ((params?: Readonly<Params<string>>) => RegExp);
  children?: BaseBreadcrumbItem[];
  type: "DASHBOARD" | "WORKSPACE" | "TRASH" | "SETTING" | "TABLE";
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
        type: "DASHBOARD",
      },
    ],
  ],
  [
    /^\/dashboard\/trash\/?$/,
    [
      {
        title: "대시보드",
        isLast: false,
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
        pathnameRegex: /^\/dashboard\/?$/,
        type: "DASHBOARD",
        children: [
          {
            title: "휴지통",
            isLast: true,
            pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.TRASH,
            pathnameRegex: /^\/dashboard\/trash\/?$/,
            type: "TRASH",
          },
        ],
      },
    ],
  ],
  [
    /^\/dashboard\/setting\/(account|system|notifications|integration)\/?$/,
    [
      {
        title: "대시보드",
        isLast: false,
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
        pathnameRegex: /^\/dashboard\/?$/,
        type: "DASHBOARD",
        children: [
          {
            title: "설정",
            isLast: false,
            pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.SETTING,
            pathnameRegex: /^\/dashboard\/setting\/?$/,
            type: "SETTING",
            children: [
              {
                title: "내 계정",
                isLast: true,
                pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.SETTING,
                pathnameRegex: /^\/dashboard\/setting\/account\/?$/,
                type: "SETTING",
              },
              {
                title: "내 설정",
                isLast: true,
                pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.SYSTEM,
                pathnameRegex: /^\/dashboard\/setting\/system\/?$/,
                type: "SETTING",
              },
              {
                title: "내 알림",
                isLast: true,
                pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.NOTIFICATIONS,
                pathnameRegex: /^\/dashboard\/setting\/notifications\/?$/,
                type: "SETTING",
              },
              {
                title: "내 연결",
                isLast: true,
                pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.INTEGRATION,
                pathnameRegex: /^\/dashboard\/setting\/integration\/?$/,
                type: "SETTING",
              },
            ],
          },
        ],
      },
    ],
  ],
  [
    /^\/dashboard\/workspaces\/[a-zA-Z0-9]+\/?$/,
    [
      {
        title: "대시보드",
        isLast: false,
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
        pathnameRegex: /^\/dashboard\/?$/,
        type: "DASHBOARD",
        children: [
          {
            title: "워크스페이스",
            isLast: false,
            pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
            pathnameRegex: /^\/dashboard\/?$/,
            type: "WORKSPACE",
            children: [
              {
                title: "테이블",
                isLast: true,
                pathname: (params) => {
                  if (params?.workspaceId) {
                    return PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ID(
                      params.workspaceId,
                    );
                  }
                  throw new Error("workspaceId is required");
                },
                pathnameRegex: /^\/dashboard\/workspaces\/[a-zA-Z0-9]+\/?$/,
                type: "TABLE",
              },
            ],
          },
        ],
      },
    ],
  ],
]);

export interface GetBreadcrumbParams {
  pathname: string;
  params?: Readonly<Params<string>>;
}

function recursiveMatch(
  items: BaseBreadcrumbItem[],
  pathname: string,
  params?: Readonly<Params<string>>,
): BaseBreadcrumbItem[] {
  for (const item of items) {
    if (isFunction(item.pathnameRegex)) {
      if (item.pathnameRegex(params).test(pathname)) {
        if (item.children) {
          return recursiveMatch(item.children, pathname);
        }
        return [item];
      } else if (item.children) {
        return recursiveMatch(item.children, pathname);
      }
      return [item];
    } else if (item.pathnameRegex instanceof RegExp) {
      if (item.pathnameRegex.test(pathname)) {
        if (item.children) {
          return recursiveMatch(item.children, pathname);
        }
        return [item];
      } else if (item.children) {
        return recursiveMatch(item.children, pathname);
      }
      return [item];
    } else if (isFunction(item.pathname)) {
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

    return [item];
  }

  return [];
}

export function getDeepBreadcrumbs({
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

export function getBreadcrumbs({
  pathname,
}: Omit<GetBreadcrumbParams, "params">) {
  for (const [regex, items] of breadcrumb) {
    if (regex.test(pathname)) {
      return items;
    }
  }

  return [];
}

export function getBreadcrumb({ pathname, params }: GetBreadcrumbParams) {
  const items = getDeepBreadcrumbs({ pathname, params });
  return items.at(-1);
}

export function getFlatBreadcrumbs({ pathname, params }: GetBreadcrumbParams) {
  const items = getDeepBreadcrumbs({ pathname, params });

  const flatItems: BaseBreadcrumbItem[] = [];
  for (const item of items) {
    flatItems.push(item);
    if (item.children) {
      flatItems.push(...getFlatBreadcrumbs({ pathname, params }));
    }
  }
  return flatItems;
}

export function initializeBreadcrumb(value: Map<RegExp, BaseBreadcrumbItem[]>) {
  for (const [regex, items] of value) {
    breadcrumb.set(regex, items);
  }
  return breadcrumb;
}
