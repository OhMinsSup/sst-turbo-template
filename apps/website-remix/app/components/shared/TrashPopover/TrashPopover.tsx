import { Link } from "@remix-run/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@template/ui/components/popover";
import { SidebarMenuButton, useSidebar } from "@template/ui/components/sidebar";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { TrashPopoverFooter } from "./TrashPopoverFooter";
import { TrashPopoverScrollArea } from "./TrashPopoverScrollArea";
import { TrashPopoverSearhBar } from "./TrashPopoverSearhBar";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-[50vh] max-h-[70vh] w-[414px] min-w-[180px] flex-col p-4"
      style={{ maxWidth: "calc(-24px + 100vw)" }}
    >
      {children}
    </div>
  );
}

export default function TrashPopover() {
  const { isMobile } = useSidebar();

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
        <Container>
          <TrashPopoverSearhBar />
          <TrashPopoverScrollArea />
        </Container>
        <TrashPopoverFooter />
      </PopoverContent>
    </Popover>
  );
}
