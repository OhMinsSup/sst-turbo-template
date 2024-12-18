import { Link } from "@remix-run/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@template/ui/components/popover";
import { SidebarMenuButton, useSidebar } from "@template/ui/components/sidebar";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { useBreadcrumb } from "~/hooks/useBreadcrumbs";
import { TrashPopoverContent } from "./components/TrashPopoverContent";
import { TrashPopoverFooter } from "./components/TrashPopoverFooter";
import { TrashProvider } from "./context/trash";

export default function TrashPopover() {
  const { isMobile } = useSidebar();
  const item = useBreadcrumb();

  if (item?.type === "TRASH") {
    return null;
  }

  if (isMobile) {
    return (
      <SidebarMenuButton tooltip="휴지통" asChild>
        <Link to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.TRASH} viewTransition>
          <Icons.Trash />
          <span>휴지통</span>
        </Link>
      </SidebarMenuButton>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarMenuButton tooltip="휴지통">
          <Icons.Trash />
          <span>휴지통</span>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        className="relative w-full overflow-hidden p-0"
        side="right"
      >
        <TrashProvider>
          <TrashPopoverContent />
          <TrashPopoverFooter />
        </TrashProvider>
      </PopoverContent>
    </Popover>
  );
}
