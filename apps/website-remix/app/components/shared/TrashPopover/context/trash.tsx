import { useMemo, useReducer } from "react";

import { createContext } from "@template/ui/lib";

enum Action {
  INITIALIZE = "INITIALIZE",
  CHANGE_SEARCH_KEYWORD = "CHANGE_SEARCH_KEYWORD",
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

interface ChangeSearchKeywordAction {
  type: Action.CHANGE_SEARCH_KEYWORD;
  payload: string;
}

type ActionType = InitializeAction | ChangeSearchKeywordAction;

interface TrashState {
  searchKeyword: string;
}

const initialState: TrashState = {
  searchKeyword: "",
};

interface VirtualGridMasonryContext extends TrashState {
  initialize: () => void;
  changeSearchKeyword: (payload: ChangeSearchKeywordAction["payload"]) => void;
  dispatch: React.Dispatch<ActionType>;
}

const [Provider, useTrashProvider] = createContext<VirtualGridMasonryContext>({
  name: "useTrashProvider",
  errorMessage: 'useTrashProvider: "context" is undefined.',
  defaultValue: initialState,
});

function reducer(state = initialState, action: ActionType): TrashState {
  switch (action.type) {
    case Action.INITIALIZE: {
      return initialState;
    }
    case Action.CHANGE_SEARCH_KEYWORD: {
      return {
        ...state,
        searchKeyword: action.payload,
      };
    }
    default:
      return state;
  }
}

interface Props {
  children: React.ReactNode;
}

function TrashProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = () => dispatch({ type: Action.INITIALIZE });

  const changeSearchKeyword = (payload: ChangeSearchKeywordAction["payload"]) =>
    dispatch({ type: Action.CHANGE_SEARCH_KEYWORD, payload });

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      initialize,
      changeSearchKeyword,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { useTrashProvider, TrashProvider };
