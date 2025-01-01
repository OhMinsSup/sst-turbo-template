import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@template/ui/components/breadcrumb";
import { Separator } from "@template/ui/components/separator";
import { SidebarTrigger } from "@template/ui/components/sidebar";

import { useBreadcrumb } from "~/providers/breadcrumb.provider";

export default function WorkspaceHeader() {
  const breadcrumb = useBreadcrumb();
  return (
    <header className="mr-4 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:border-b-[1px]">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumb?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
