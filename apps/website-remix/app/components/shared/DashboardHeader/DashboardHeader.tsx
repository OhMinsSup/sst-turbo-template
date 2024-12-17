import type { Params } from "@remix-run/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@template/ui/components/breadcrumb";
import { Button } from "@template/ui/components/button";
import { Separator } from "@template/ui/components/separator";
import { SidebarTrigger } from "@template/ui/components/sidebar";
import { isFunction } from "@template/utils/assertion";

import type { BaseBreadcrumbItem } from "./breadcrumb";
import { Icons } from "~/components/icons";
import { User } from "~/components/shared/User";
import { useBreadcrumbs } from "~/hooks/useBreadcrumbs";

export type BreadcrumbItem = BaseBreadcrumbItem;

interface RecursiveBreadcrumbItemProps {
  item: BreadcrumbItem;
  parentIndex?: number;
  searchParams?: Readonly<Params<string>>;
}

function RecursiveBreadcrumbItem({
  item,
  searchParams,
  parentIndex = 0,
}: RecursiveBreadcrumbItemProps) {
  const pathname = isFunction(item.pathname)
    ? item.pathname(searchParams)
    : item.pathname;

  return (
    <>
      {item.isLast ? (
        <BreadcrumbItem>
          <BreadcrumbPage>{item.title}</BreadcrumbPage>
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={pathname}>{item.title}</BreadcrumbLink>
        </BreadcrumbItem>
      )}
      {typeof item.children !== "undefined" && item.children.length > 0 ? (
        <>
          <BreadcrumbSeparator className="hidden md:block" />
          {item.children.map((child, index) => {
            return (
              <RecursiveBreadcrumbItem
                key={`recursive:breadcumb${parentIndex}:${index}`}
                item={child}
                parentIndex={index}
                searchParams={searchParams}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
}

export default function DashboardHeader() {
  const { items, searchParams } = useBreadcrumbs();
  return (
    <header className="mr-4 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:border-b-[1px]">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => {
              return (
                <RecursiveBreadcrumbItem
                  key={`recursive:breadcumb:${index}`}
                  item={item}
                  parentIndex={index}
                  searchParams={searchParams}
                />
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center space-x-3">
        <Button variant="outline" size="icon">
          <Icons.Bell className="h-6 w-6" />
        </Button>
        <User />
      </div>
    </header>
  );
}
