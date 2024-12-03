import React from "react";

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

export default function DashboardHeader() {
  return (
    <header className="mr-4 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:border-b-[1px]">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">대시보드</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>워크스페이스</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center space-x-3">
        <Button variant="outline">Feedback</Button>
        <Button variant="outline" size="icon">
          <Icons.Bell className="h-6 w-6" />
        </Button>
        <User />
      </div>
    </header>
  );
}
