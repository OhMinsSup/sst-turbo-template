import React from "react";

import type { SidebarSortingDropdownProps } from "~/components/shared/SidebarSortingDropdown";
import { SidebarSortingDropdown } from "~/components/shared/SidebarSortingDropdown";

export interface SidebarMenuNavTitlebarProps
  extends Partial<SidebarSortingDropdownProps> {
  title: React.ReactNode;
  usedSortingComponent?: boolean;
  addFormComponent?: React.ReactNode;
}

export default function SidebarMenuNavTitlebar({
  title,
  addFormComponent,
  usedSortingComponent = true,
  ...sidebarSortingDropdownProps
}: SidebarMenuNavTitlebarProps) {
  return (
    <>
      <span>{title}</span>
      <div className="flex flex-row gap-2">
        {usedSortingComponent && (
          <SidebarSortingDropdown {...sidebarSortingDropdownProps} />
        )}
        {addFormComponent}
      </div>
    </>
  );
}
