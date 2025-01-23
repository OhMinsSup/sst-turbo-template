import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@template/ui/components/resizable";

interface EditorLayoutProps {
  children: React.ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex size-full flex-row overflow-hidden"
    >
      <ResizablePanel
        className="hidden min-w-64 max-w-[32rem] md:flex"
        defaultSize={4.7}
      >
        <div className="flex h-full w-full flex-col">Sidebar</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="flex h-full flex-col" defaultSize={95.3}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
