import React from "react";
import { Outlet } from "@remix-run/react";

import { SettingSidebarNav } from "~/components/setting/SettingSidebarNav";

export default function Routes() {
  return (
    <div className="flex flex-1 flex-col space-y-8 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="top-0 lg:sticky lg:w-1/5">
        <SettingSidebarNav />
      </aside>
      <div className="relative h-full flex-grow overflow-hidden">
        <div className="flex size-full flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
