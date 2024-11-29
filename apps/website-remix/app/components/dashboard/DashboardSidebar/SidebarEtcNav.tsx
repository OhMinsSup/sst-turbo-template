import { Button } from "@template/ui/components/button";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@template/ui/components/sidebar";

import { Icons } from "~/components/icons";

export default function SidebarEtcNav() {
  return (
    <>
      <SidebarMenuButton tooltip="설정">
        <Icons.Settings />
        <span>설정</span>
      </SidebarMenuButton>
      <SidebarMenuButton tooltip="휴지통">
        <Icons.Trash />
        <span>휴지통</span>
      </SidebarMenuButton>
    </>
  );
}
