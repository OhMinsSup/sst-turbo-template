import React, { useMemo, useReducer } from "react";

import { createContext } from "@template/ui/lib";

enum Action {
  INITIALIZE = "INITIALIZE",
  CHANGE_LIMIT = "CHANGE_LIMIT",
  CHANGE_SORT_TAG = "CHANGE_SORT_TAG",
  CHANGE_SORT_ORDER = "CHANGE_SORT_ORDER",
  OPEN_DIALOG = "OPEN_DIALOG",
  CLOSE_DIALOG = "CLOSE_DIALOG",
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
    value: "createdAt" | "updatedAt" | "order";
  };
}

interface ChangeSortOrderAction {
  type: Action.CHANGE_SORT_ORDER;
  payload: {
    value: "asc" | "desc";
  };
}

interface OpenDialogAction {
  type: Action.OPEN_DIALOG;
  payload: {
    type: "delete" | "edit" | "create";
  };
}

interface CloseDialogAction {
  type: Action.CLOSE_DIALOG;
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

type ActionType =
  | InitializeAction
  | ChangeLimitAciotn
  | ChangeSortTagAction
  | ChangeSortOrderAction
  | OpenDialogAction
  | CloseDialogAction;

interface QueryState {
  limit: number;
  sortTag: "createdAt" | "updatedAt" | "order";
  sortOrder: "asc" | "desc";
}

interface DialogState {
  isOpen: boolean;
  type: "delete" | "edit" | "create" | undefined;
}

interface WorkspaceSidebarState {
  query: QueryState;
  dialog: DialogState;
}

interface WorkspaceSidebarContext extends WorkspaceSidebarState {
  initialize: () => void;
  changeLimit: (payload: ChangeLimitAciotn["payload"]) => void;
  changeSortTag: (payload: ChangeSortTagAction["payload"]) => void;
  changeSortOrder: (payload: ChangeSortOrderAction["payload"]) => void;
  openDialog: (payload: OpenDialogAction["payload"]) => void;
  closeDialog: () => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: WorkspaceSidebarState = {
  query: {
    limit: 5,
    sortTag: "createdAt",
    sortOrder: "desc",
  },
  dialog: {
    isOpen: false,
    type: undefined,
  },
};

const [Provider, useWorkspaceSidebarProvider] =
  createContext<WorkspaceSidebarContext>({
    name: "useWorkspaceSidebarProvider",
    errorMessage: 'useWorkspaceSidebarProvider: "context" is undefined.',
    defaultValue: initialState,
  });

interface Props {
  children: React.ReactNode;
}

function reducer(
  state = initialState,
  action: ActionType,
): WorkspaceSidebarState {
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
    case Action.OPEN_DIALOG: {
      return {
        ...state,
        dialog: {
          isOpen: true,
          type: action.payload.type,
        },
      };
    }
    case Action.CLOSE_DIALOG: {
      return {
        ...state,
        dialog: {
          isOpen: false,
          type: undefined,
        },
      };
    }
    default:
      return state;
  }
}

function WorkspaceSidebarProvider({ children }: Props) {
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

  const openDialog = (payload: OpenDialogAction["payload"]) => {
    dispatch({ type: Action.OPEN_DIALOG, payload });
  };

  const closeDialog = () => {
    dispatch({ type: Action.CLOSE_DIALOG });
  };

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      changeLimit,
      changeSortTag,
      changeSortOrder,
      openDialog,
      closeDialog,
      initialize,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { WorkspaceSidebarProvider, useWorkspaceSidebarProvider };
