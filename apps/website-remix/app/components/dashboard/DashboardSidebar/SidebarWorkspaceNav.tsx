import type { components } from "@template/api-types";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@template/ui/components/sidebar";

import type { WorkspaceType } from "./SidebarWorkspaceMneuItems";
import { SidebarEmptyMessage } from "./SidebarEmptyMessage";
import { SidebarTitle } from "./SidebarTitle";
import { SidebarWorkspaceMneuItems } from "./SidebarWorkspaceMneuItems";

interface SidebarWorkspaceNavProps {
  workspaceType: WorkspaceType;
  title: string;
  items: components["schemas"]["WorkspaceEntity"][];
}
export function SidebarWorkspaceNav({
  title,
  workspaceType,
  items,
}: SidebarWorkspaceNavProps) {
  const { state } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between">
        <SidebarTitle title={title} workspaceType={workspaceType} />
      </SidebarGroupLabel>
      <SidebarMenu>
        {!items.length && state === "expanded" ? (
          <SidebarEmptyMessage emptyMessage="워크스페이스가 없습니다." />
        ) : (
          <SidebarWorkspaceMneuItems
            initialData={items}
            workspaceType={workspaceType}
          />
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
