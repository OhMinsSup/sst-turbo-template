import React from "react";

interface SidebarEmptyMessageProps {
  display?: boolean;
  emptyMessage?: React.ReactNode;
}

export function SidebarEmptyMessage({
  display,
  emptyMessage,
}: SidebarEmptyMessageProps) {
  if (!display) {
    return null;
  }
  return (
    <div className="p-2">
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    </div>
  );
}
