import { useMemo, useReducer } from "react";
import { useLocation, useParams } from "@remix-run/react";

import { createContext } from "@template/ui/lib";
import { isEmpty } from "@template/utils/assertion";

import type {
  BaseBreadcrumbItem,
  GetBreadcrumbParams,
} from "./breadcrumb.utils";
import * as breadcrumb from "./breadcrumb.utils";

enum Action {
  INITIALIZE = "INITIALIZE",
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

type ActionType = InitializeAction;

interface BreadcrumbState {
  breadcrumb: Map<RegExp, BaseBreadcrumbItem[]>;
}

const initialState: BreadcrumbState = {
  breadcrumb: new Map<RegExp, BaseBreadcrumbItem[]>(),
};

interface BreadcrumbContext extends BreadcrumbState {
  initialize: () => void;
  getDeepBreadcrumbs: (args: GetBreadcrumbParams) => BaseBreadcrumbItem[];
  getBreadcrumbs: (
    args: Omit<GetBreadcrumbParams, "params">,
  ) => BaseBreadcrumbItem[];
  getFlatBreadcrumbs: (args: GetBreadcrumbParams) => BaseBreadcrumbItem[];
  getBreadcrumb: (args: GetBreadcrumbParams) => BaseBreadcrumbItem | undefined;
  dispatch: React.Dispatch<ActionType>;
}

const [Provider, useBreadcrumbProvider] = createContext<BreadcrumbContext>({
  name: "useBreadcrumbProvider",
  errorMessage: 'useBreadcrumbProvider: "context" is undefined.',
  defaultValue: initialState,
});

function reducer(state = initialState, action: ActionType): BreadcrumbState {
  switch (action.type) {
    case Action.INITIALIZE: {
      return initialState;
    }
    default:
      return state;
  }
}

interface Props {
  children: React.ReactNode;
}

function hydrateBreadcrumb(initialState: BreadcrumbState) {
  initialState.breadcrumb = breadcrumb.initializeBreadcrumb(
    initialState.breadcrumb,
  );
  return {
    ...initialState,
  };
}

function BreadcrumbProvider({ children }: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    hydrateBreadcrumb(initialState),
  );

  const initialize = () => dispatch({ type: Action.INITIALIZE });

  const getDeepBreadcrumbs = (args: GetBreadcrumbParams) => {
    return breadcrumb.getDeepBreadcrumbs(args);
  };

  const getBreadcrumbs = (args: Omit<GetBreadcrumbParams, "params">) => {
    return breadcrumb.getBreadcrumbs(args);
  };

  const getFlatBreadcrumbs = (args: GetBreadcrumbParams) => {
    return breadcrumb.getFlatBreadcrumbs(args);
  };

  const getBreadcrumb = (args: GetBreadcrumbParams) => {
    return breadcrumb.getBreadcrumb(args);
  };

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      getBreadcrumb,
      getBreadcrumbs,
      getDeepBreadcrumbs,
      getFlatBreadcrumbs,
      initialize,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export function useBreadcrumbs() {
  const params = useParams();
  const location = useLocation();
  const { getBreadcrumbs } = useBreadcrumbProvider();

  const safyParams = useMemo(() => {
    return isEmpty(params) ? undefined : params;
  }, [params]);

  const items = useMemo(() => {
    return getBreadcrumbs({
      pathname: location.pathname,
    });
  }, [location.pathname, getBreadcrumbs]);

  return {
    items,
    searchParams: safyParams,
  };
}

export function useBreadcrumb() {
  const location = useLocation();
  const { searchParams } = useBreadcrumbs();
  const { getFlatBreadcrumbs } = useBreadcrumbProvider();

  const flatItems = useMemo(() => {
    return getFlatBreadcrumbs({
      pathname: location.pathname,
      params: searchParams,
    });
  }, [searchParams, location.pathname, getFlatBreadcrumbs]);

  return useMemo(() => flatItems.at(-1), [flatItems]);
}

export { useBreadcrumbProvider, BreadcrumbProvider };
