import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-full flex-1 flex-col space-y-8 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">워크스페이스</h2>
            <p className="text-muted-foreground">
              워크스페이스의 모든 것을 관리하세요.
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
