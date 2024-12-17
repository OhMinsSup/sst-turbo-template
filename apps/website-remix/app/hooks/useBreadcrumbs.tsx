import { useMemo } from "react";
import { useLocation, useParams } from "@remix-run/react";

import { isEmpty } from "@template/utils/assertion";

import {
  getBreadcrumbs,
  getFlatBreadcrumb,
} from "~/components/shared/DashboardHeader/breadcrumb";

export function useBreadcrumbs() {
  const params = useParams();
  const location = useLocation();

  const safyParams = useMemo(() => {
    return isEmpty(params) ? undefined : params;
  }, [params]);

  const items = useMemo(() => {
    return getBreadcrumbs({
      pathname: location.pathname,
    });
  }, [location.pathname]);

  return {
    items,
    searchParams: safyParams,
  };
}

export function useBreadcrumb() {
  const data = useBreadcrumbs();
  const location = useLocation();

  const flatItems = useMemo(() => {
    return getFlatBreadcrumb({
      pathname: location.pathname,
      params: data.searchParams,
    });
  }, [data.searchParams, location.pathname]);

  return useMemo(() => flatItems.at(-1), [flatItems]);
}
