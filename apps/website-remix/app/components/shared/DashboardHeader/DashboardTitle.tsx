import React, { useMemo } from "react";
import { useLocation, useParams } from "@remix-run/react";

import { isEmpty } from "@template/utils/assertion";

import { getBreadcrumb } from "./breadcrumb";

export interface DashboardTitleProps {
  children: React.ReactNode;
  noDisplayTitle?: boolean;
}

export default function DashboardTitle({
  children,
  noDisplayTitle,
}: DashboardTitleProps) {
  const params = useParams();
  const location = useLocation();

  const safyParams = useMemo(() => {
    return isEmpty(params) ? undefined : params;
  }, [params]);

  const item = useMemo(() => {
    return getBreadcrumb({
      pathname: location.pathname,
      params: safyParams,
    });
  }, [location.pathname, safyParams]);

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
