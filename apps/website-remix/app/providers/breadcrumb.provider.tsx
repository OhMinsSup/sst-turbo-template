import { createContext, useContext, useMemo, useRef } from "react";
import { useLocation, useParams } from "@remix-run/react";
import { createStore, useStore } from "zustand";

import { isEmpty } from "@template/utils/assertion";

import type { BreadcrumbItem, GetBreadcrumbParams } from "./breadcrumb.types";
import { breadcrumbs } from "./breadcrumb.data";
import * as breadcrumb from "./breadcrumb.utils";

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbState extends BreadcrumbProps {
  getBreadcrumbs: (args: GetBreadcrumbParams) => BreadcrumbItem[];
  getBreadcrumb: (args: GetBreadcrumbParams) => BreadcrumbItem | undefined;
}

export const createBreadcrumbStore = (initProps?: Partial<BreadcrumbProps>) => {
  const DEFAULT_PROPS: BreadcrumbProps = {
    breadcrumbs,
  };
  return createStore<BreadcrumbState>()((_, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    getBreadcrumbs: (args) =>
      breadcrumb.findBreadcrumbPathList(
        get().breadcrumbs,
        args.pathname,
        args.params,
      ),
    getBreadcrumb: (args) =>
      breadcrumb.findBreadcrumbPath(
        get().breadcrumbs,
        args.pathname,
        args.params,
      ),
  }));
};

type BreadcrumbStore = ReturnType<typeof createBreadcrumbStore>;

export const BreadcrumbContext = createContext<BreadcrumbStore | null>(null);

type BreadcrumbProviderProps = React.PropsWithChildren<BreadcrumbProps>;

function BreadcrumbProvider({ children, ...props }: BreadcrumbProviderProps) {
  const storeRef = useRef<BreadcrumbStore>();
  if (!storeRef.current) {
    storeRef.current = createBreadcrumbStore(props);
  }
  return (
    <BreadcrumbContext.Provider value={storeRef.current}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

function useBreadcrumbContext<T>(selector: (state: BreadcrumbState) => T): T {
  const store = useContext(BreadcrumbContext);
  if (!store) throw new Error("Missing BreadcrumbContext.Provider in the tree");
  return useStore(store, selector);
}

export function useBreadcrumbs() {
  const params = useParams();
  const location = useLocation();
  const getBreadcrumbs = useBreadcrumbContext((state) => state.getBreadcrumbs);

  const safyParams = useMemo(() => {
    return isEmpty(params) ? undefined : params;
  }, [params]);

  const items = useMemo(() => {
    return getBreadcrumbs({
      pathname: location.pathname,
      params: safyParams,
    });
  }, [location.pathname, getBreadcrumbs, safyParams]);

  return {
    items,
    pathname: location.pathname,
    params: safyParams,
  };
}

export function useBreadcrumb() {
  const { params, pathname } = useBreadcrumbs();
  const getBreadcrumb = useBreadcrumbContext((state) => state.getBreadcrumb);
  return useMemo(() => {
    return getBreadcrumb({
      pathname,
      params,
    });
  }, [params, pathname, getBreadcrumb]);
}

export { useBreadcrumbContext, BreadcrumbProvider };
