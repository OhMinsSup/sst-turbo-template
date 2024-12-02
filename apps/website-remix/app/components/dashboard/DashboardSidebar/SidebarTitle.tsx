import { SidebarUpsertWorkspaceForm } from "./SidebarUpsertWorkspaceForm";
import { WorkspaceType } from "./SidebarWorkspaceMneuItems";
import { SidebarWorkspaceSortingDropdown } from "./SidebarWorkspaceSortingDropdown";

interface SidebarTitleProps {
  title: string;
  workspaceType: WorkspaceType;
}

export function SidebarTitle({ title, workspaceType }: SidebarTitleProps) {
  return (
    <>
      <span>{title}</span>
      <div className="flex flex-row gap-2">
        <SidebarWorkspaceSortingDropdown workspaceType={workspaceType} />
        {workspaceType === WorkspaceType.Default && (
          <SidebarUpsertWorkspaceForm />
        )}
      </div>
    </>
  );
}
