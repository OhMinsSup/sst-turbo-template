import React from "react";

export interface SidebarItemEmptyMessageProps {
  emptyMessage?: React.ReactNode;
}

export default function SidebarItemEmptyMessage({
  emptyMessage = "데이터가 없습니다.",
}: SidebarItemEmptyMessageProps) {
  return (
    <div className="p-2">
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    </div>
  );
}
