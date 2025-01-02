import type { Params } from "@remix-run/react";

interface BaseBreadcrumbItem {
  title: string;
  description?: string;
  pathname?: string | ((params?: Readonly<Params<string>>) => string);
  children?: BaseBreadcrumbItem[];
  type:
    | "DASHBOARD"
    | "WORKSPACE"
    | "PREFERENCES"
    | "ACCOUNT"
    | "TABLE"
    | "HOME";
}

export type BreadcrumbItem = BaseBreadcrumbItem;

export interface GetBreadcrumbParams {
  pathname: string;
  params?: Readonly<Params<string>>;
}
