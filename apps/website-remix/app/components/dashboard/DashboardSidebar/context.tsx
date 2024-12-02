import React, { useMemo, useReducer } from "react";

import { createContext } from "@template/ui/lib";

enum Action {
  INITIALIZE = "INITIALIZE",
  CHANGE_LIMIT = "CHANGE_LIMIT",
  CHANGE_SORT_TAG = "CHANGE_SORT_TAG",
  CHANGE_SORT_ORDER = "CHANGE_SORT_ORDER",
}

interface ChangeLimitAciotn {
  type: Action.CHANGE_LIMIT;
  payload: {
    value: number;
  };
}

interface ChangeSortTagAction {
  type: Action.CHANGE_SORT_TAG;
  payload: {
    value: "createdAt" | "updatedAt" | "order" | undefined;
  };
}

interface ChangeSortOrderAction {
  type: Action.CHANGE_SORT_ORDER;
  payload: {
    value: "asc" | "desc" | undefined;
  };
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

type ActionType =
  | InitializeAction
  | ChangeLimitAciotn
  | ChangeSortTagAction
  | ChangeSortOrderAction;

interface QueryState {
  limit: number;
  sortTag: "createdAt" | "updatedAt" | "order" | undefined;
  sortOrder: "asc" | "desc" | undefined;
}

interface DashboardSidebarState {
  query: QueryState;
}

interface DashboardSidebarContext extends DashboardSidebarState {
  initialize: () => void;
  changeLimit: (payload: ChangeLimitAciotn["payload"]) => void;
  changeSortTag: (payload: ChangeSortTagAction["payload"]) => void;
  changeSortOrder: (payload: ChangeSortOrderAction["payload"]) => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: DashboardSidebarState = {
  query: {
    limit: 5,
    sortTag: "createdAt",
    sortOrder: undefined,
  },
};

const [Provider, useDashboardSidebarProvider] =
  createContext<DashboardSidebarContext>({
    name: "useDashboardSidebarProvider",
    errorMessage: 'useDashboardSidebarProvider: "context" is undefined.',
    defaultValue: initialState,
  });

interface Props {
  children: React.ReactNode;
}

function reducer(
  state = initialState,
  action: ActionType,
): DashboardSidebarState {
  switch (action.type) {
    case Action.INITIALIZE: {
      return initialState;
    }
    case Action.CHANGE_LIMIT: {
      return {
        ...state,
        query: {
          ...state.query,
          limit: action.payload.value,
        },
      };
    }
    case Action.CHANGE_SORT_TAG: {
      return {
        ...state,
        query: {
          ...state.query,
          sortTag: action.payload.value,
        },
      };
    }
    case Action.CHANGE_SORT_ORDER: {
      return {
        ...state,
        query: {
          ...state.query,
          sortOrder: action.payload.value,
        },
      };
    }
    default:
      return state;
  }
}

function DashboardSidebarProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = () => {
    dispatch({ type: Action.INITIALIZE });
  };

  const changeLimit = (payload: ChangeLimitAciotn["payload"]) => {
    dispatch({ type: Action.CHANGE_LIMIT, payload });
  };

  const changeSortTag = (payload: ChangeSortTagAction["payload"]) => {
    dispatch({ type: Action.CHANGE_SORT_TAG, payload });
  };

  const changeSortOrder = (payload: ChangeSortOrderAction["payload"]) => {
    dispatch({ type: Action.CHANGE_SORT_ORDER, payload });
  };

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      changeLimit,
      changeSortTag,
      changeSortOrder,
      initialize,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { DashboardSidebarProvider, useDashboardSidebarProvider };
