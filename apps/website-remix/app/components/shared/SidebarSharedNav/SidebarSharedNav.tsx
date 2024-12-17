import { SettingDialog } from "~/components/shared/SettingDialog";
import { TrashPopover } from "~/components/shared/TrashPopover";

export default function SidebarSharedNav() {
  return (
    <>
      <SettingDialog />
      <TrashPopover />
    </>
  );
}
