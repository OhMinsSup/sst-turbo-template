import { SidebarUpsertWorkspaceForm } from "./SidebarUpsertWorkspaceForm";
import { SidebarWorkspaceSortingDropdown } from "./SidebarWorkspaceSortingDropdown";

interface SidebarTitleProps {
  title: string;
  type: "favorite" | "default";
}

export function SidebarTitle({ title }: SidebarTitleProps) {
  return (
    <>
      <span>{title}</span>
      <div className="flex flex-row gap-2">
        <SidebarWorkspaceSortingDropdown />
        <SidebarUpsertWorkspaceForm />
      </div>
    </>
  );
}
