import React from "react";
import { Link } from "@remix-run/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@template/ui/components/breadcrumb";
import { Separator } from "@template/ui/components/separator";
import { SidebarTrigger } from "@template/ui/components/sidebar";
import { isFunction } from "@template/utils/assertion";

import { useBreadcrumbs } from "~/providers/breadcrumb.provider";

export default function DashboardHeader() {
  const { items, params } = useBreadcrumbs();
  console.log(items);
  return (
    <header className="mr-4 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:border-b-[1px]">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => {
              const pathname = isFunction(item.pathname)
                ? item.pathname(params)
                : item.pathname;

              const isLastMatch = index === items.length - 1;
              if (isLastMatch) {
                return (
                  <React.Fragment key={`breadcrumb:last:${index}`}>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbItem>
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={`breadcrumb:children:${index}`}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={pathname} asChild>
                      <Link viewTransition to={pathname ?? "#"}>
                        {item.title}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
