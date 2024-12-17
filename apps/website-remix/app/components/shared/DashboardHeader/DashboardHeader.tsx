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

import { Icons } from "~/components/icons";
import { User } from "~/components/shared/User";
import { useBreadcrumbs } from "~/hooks/useBreadcrumbs";

export interface BaseBreadcrumbItem {
  title: string;
  isLast: boolean;
  pathname: string;
  pathnameRegex?: RegExp;
}

export type BreadcrumbItem = BaseBreadcrumbItem;

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
              if (item.isLast) {
                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }

              if (
                typeof item.children !== "undefined" &&
                item.children.length > 0
              ) {
                return item.children.map((child, childIndex) => {
                  const childPathname =
                    typeof child.pathname === "function"
                      ? child.pathname(searchParams)
                      : child.pathname;

                  return (
                    <BreadcrumbItem key={childIndex}>
                      <BreadcrumbLink href={childPathname}>
                        {child.title}
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </BreadcrumbItem>
                  );
                });
              }

              const pathname =
                typeof item.pathname === "function"
                  ? item.pathname(searchParams)
                  : item.pathname;

              return (
                <BreadcrumbItem key={index} className="hidden md:block">
                  <BreadcrumbLink href={pathname}>{item.title}</BreadcrumbLink>
                  <BreadcrumbSeparator className="hidden md:block" />
                </BreadcrumbItem>
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
