import { useMemo } from "react";
import { useLocation, useParams } from "@remix-run/react";

import { isEmpty } from "@template/utils/assertion";

import { getBreadcrumbs } from "~/components/shared/DashboardHeader/breadcrumb";

export function useBreadcrumbs() {
  const params = useParams();
  const location = useLocation();

  const safyParams = useMemo(() => {
    return isEmpty(params) ? undefined : params;
  }, [params]);

  const items = useMemo(() => {
    return getBreadcrumbs({
      pathname: location.pathname,
      params: safyParams,
    });
  }, [location.pathname, safyParams]);

  return {
    items,
    searchParams: safyParams,
  };
}

export function useBreadcrumb() {
  const data = useBreadcrumbs();
  return useMemo(() => data.items.at(-1), [data.items]);
}
