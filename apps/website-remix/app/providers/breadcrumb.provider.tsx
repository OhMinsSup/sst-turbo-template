import { createContext, useContext, useMemo, useRef } from "react";
import { useLocation, useParams } from "@remix-run/react";
import { createStore, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

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

type BreadcrumbProviderProps = React.PropsWithChildren<
  Partial<BreadcrumbProps>
>;

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
  const { pathname } = useLocation();
  const getBreadcrumbs = useBreadcrumbContext(
    useShallow((state) => state.getBreadcrumbs),
  );

  const items = useMemo(
    () =>
      getBreadcrumbs({
        pathname,
        params,
      }),
    [pathname, getBreadcrumbs, params],
  );

  return {
    items,
    pathname,
    params,
  };
}

export function useBreadcrumb() {
  const { params, pathname } = useBreadcrumbs();
  const getBreadcrumb = useBreadcrumbContext(
    useShallow((state) => state.getBreadcrumb),
  );

  return useMemo(
    () =>
      getBreadcrumb({
        pathname,
        params,
      }),
    [params, pathname, getBreadcrumb],
  );
}

export { useBreadcrumbContext, BreadcrumbProvider };
