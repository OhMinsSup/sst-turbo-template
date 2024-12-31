import React from "react";

import { useBreadcrumb } from "~/providers/breadcrumb.provider";

export interface DashboardTitleProps {
  children: React.ReactNode;
  noDisplayTitle?: boolean;
}

export default function DashboardTitle({
  children,
  noDisplayTitle,
}: DashboardTitleProps) {
  const item = useBreadcrumb();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <>
        {noDisplayTitle ? null : (
          <>
            {item ? (
              <div className="flex items-center justify-between space-y-2">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {item.title}
                  </h2>
                  {item.description ? (
                    <p className="text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        )}
      </>
      {children}
    </div>
  );
}
