'use client';
import { useMemo, useReducer } from 'react';
import { createContext } from '@template/react-hooks';

enum Action {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CHANGE_DATA_KEY = 'CHANGE_DATA_KEY',
}

interface ChangeDataKeyAction {
  type: Action.CHANGE_DATA_KEY;
  payload: {
    dataKey: symbol;
  };
}

type AppAction = ChangeDataKeyAction;

interface AppState {
  dataKey: symbol;
}

interface AppContext extends AppState {
  changeDataKey: (dataKey: symbol) => void;
  dispatch: React.Dispatch<AppAction>;
}

const initialState: AppState = {
  dataKey: Symbol('dataKey'),
};

const [Provider, useAppContext] = createContext<AppContext>({
  name: 'useAppContext',
  errorMessage: 'useAppContext: `context` is undefined.',
  defaultValue: initialState as AppContext,
});

// eslint-disable-next-line @typescript-eslint/default-param-last
function reducer(state = initialState, action: AppAction) {
  switch (action.type) {
    case Action.CHANGE_DATA_KEY:
      return {
        ...state,
        dataKey: action.payload.dataKey,
      };
    default:
      return state;
  }
}

interface AppProviderProps {
  children: React.ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const changeDataKey = (dataKey: symbol) => {
    dispatch({ type: Action.CHANGE_DATA_KEY, payload: { dataKey } });
  };

  const actions = useMemo(
    () => ({
      ...state,
      changeDataKey,
      dispatch,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { AppProvider, useAppContext };
