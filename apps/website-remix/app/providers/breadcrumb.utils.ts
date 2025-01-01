import type { Params } from "@remix-run/react";

import { isFunction } from "@template/utils/assertion";

import { breadcrumb } from "./breadcrumb.data";

export interface BaseBreadcrumbItem {
  title: string;
  isLast: boolean;
  description?: string;
  pathname: string | ((params?: Readonly<Params<string>>) => string);
  pathnameRegex?: RegExp | ((params?: Readonly<Params<string>>) => RegExp);
  children?: BaseBreadcrumbItem[];
  type:
    | "DASHBOARD"
    | "WORKSPACE"
    | "PREFERENCES"
    | "ACCOUNT"
    | "TABLE"
    | "HOME";
}

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
    console.log(item);

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

  console.log(items);

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
