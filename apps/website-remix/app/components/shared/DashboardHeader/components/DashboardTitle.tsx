import React from "react";

import { cn } from "@template/ui/lib";

import { useBreadcrumb } from "~/providers/breadcrumb.provider";

export interface DashboardTitleProps {
  children: React.ReactNode;
  noPadding?: boolean;
  noDisplayTitle?: boolean;
}

export default function DashboardTitle({
  children,
  noDisplayTitle,
  noPadding,
}: DashboardTitleProps) {
  const item = useBreadcrumb();

  return (
    <div
      className={cn("h-full flex-1 flex-col space-y-8 md:flex", {
        "md:p-6": !noPadding,
      })}
    >
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
