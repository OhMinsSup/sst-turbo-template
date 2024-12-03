import React from "react";

import type { SidebarSortingDropdownProps } from "~/components/shared/SidebarSortingDropdown";
import { SidebarSortingDropdown } from "~/components/shared/SidebarSortingDropdown";

export interface SidebarMenuNavTitlebarProps
  extends SidebarSortingDropdownProps {
  title: React.ReactNode;
  addFormComponent?: React.ReactNode;
}

export default function SidebarMenuNavTitlebar({
  title,
  addFormComponent,
  ...sidebarSortingDropdownProps
}: SidebarMenuNavTitlebarProps) {
  return (
    <>
      <span>{title}</span>
      <div className="flex flex-row gap-2">
        <SidebarSortingDropdown {...sidebarSortingDropdownProps} />
        {addFormComponent}
      </div>
    </>
  );
}
