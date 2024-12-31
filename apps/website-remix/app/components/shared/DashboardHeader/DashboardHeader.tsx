import { Breadcrumb, BreadcrumbList } from "@template/ui/components/breadcrumb";
import { Separator } from "@template/ui/components/separator";
import { SidebarTrigger } from "@template/ui/components/sidebar";

import { User } from "~/components/shared/User";
import { useBreadcrumbs } from "~/providers/breadcrumb.provider";
import { RecursiveBreadcrumbItem } from "./components/RecursiveBreadcrumbItem";

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
        <User />
      </div>
    </header>
  );
}
