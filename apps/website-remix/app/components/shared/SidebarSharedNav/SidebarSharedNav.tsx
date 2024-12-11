import { SidebarMenuButton } from "@template/ui/components/sidebar";

import { Icons } from "~/components/icons";
import { SettingDialog } from "../SettingDialog";

export default function SidebarSharedNav() {
  return (
    <>
      <SettingDialog />
      <SidebarMenuButton tooltip="휴지통">
        <Icons.Trash />
        <span>휴지통</span>
      </SidebarMenuButton>
    </>
  );
}
