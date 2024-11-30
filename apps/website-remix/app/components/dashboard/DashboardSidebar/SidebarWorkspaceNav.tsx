import { Link } from "@remix-run/react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@template/ui/components/sidebar";

import type { WorkspaceMenuItem } from "./DashboardWorkspaceSidebar";
import { SidebarEmptyMessage } from "./SidebarEmptyMessage";
import { SidebarTitle } from "./SidebarTitle";

interface SidebarWorkspaceNavProps {
  type: "favorite" | "default";
  title: string;
  items: WorkspaceMenuItem[];
  emptyMessage?: React.ReactNode;
}
export function SidebarWorkspaceNav({
  title,
  items,
  type,
  emptyMessage = "등록된 워크스페이스가 없습니다.",
}: SidebarWorkspaceNavProps) {
  const { state } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between">
        <SidebarTitle title={title} type={type} />
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map(({ to, title, icon: IconComponent, ...item }) => (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton tooltip={title} asChild>
              <Link to={to} {...item}>
                {IconComponent && <IconComponent />}
                <span>{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarEmptyMessage
          emptyMessage={emptyMessage}
          display={items.length === 0 && state === "expanded"}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
