import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@template/ui/components/sidebar";

import type { SidebarMenuNavTitlebarProps } from "~/components/shared/SidebarMenuNavTitlebar";
import { SidebarMenuNavTitlebar } from "~/components/shared/SidebarMenuNavTitlebar";

export type SidebarMenuNavProps = SidebarMenuNavTitlebarProps & {
  children: React.ReactNode;
};
export default function SidebarMenuNav({
  children,
  ...sidebarMenuNavTitlebarProps
}: SidebarMenuNavProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between">
        <SidebarMenuNavTitlebar {...sidebarMenuNavTitlebarProps} />
      </SidebarGroupLabel>
      <SidebarMenu>{children}</SidebarMenu>
    </SidebarGroup>
  );
}
