import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@template/ui/components/sidebar";

import type { SidebarMenuNavTitlebarProps } from "~/components/shared/SidebarMenuNavTitlebar";
import { SidebarMenuNavTitlebar } from "~/components/shared/SidebarMenuNavTitlebar";

export type SidebarMenuNavProps = Omit<SidebarMenuNavTitlebarProps, "title"> &
  Partial<Pick<SidebarMenuNavTitlebarProps, "title">> & {
    children: React.ReactNode;
  };
export default function SidebarMenuNav({
  children,
  title,
  ...sidebarMenuNavTitlebarProps
}: SidebarMenuNavProps) {
  return (
    <SidebarGroup>
      {title ? (
        <SidebarGroupLabel className="flex justify-between">
          <SidebarMenuNavTitlebar
            title={title}
            {...sidebarMenuNavTitlebarProps}
          />
        </SidebarGroupLabel>
      ) : null}
      <SidebarMenu>{children}</SidebarMenu>
    </SidebarGroup>
  );
}
