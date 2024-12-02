import React from "react";

interface SidebarEmptyMessageProps {
  emptyMessage?: React.ReactNode;
}

export function SidebarEmptyMessage({
  emptyMessage,
}: SidebarEmptyMessageProps) {
  return (
    <div className="p-2">
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    </div>
  );
}
