'use client';

/* eslint-disable @typescript-eslint/naming-convention */
import React, { useMemo, useReducer } from 'react';

import { createContext } from '@template/react-hooks/context';

export type FilterType = 'ADD' | 'REMOVE' | 'NONE';

enum Action {
  INITIALIZE = 'INITIALIZE',
  CHANGE_SKIPPED = 'CHANGE_SKIPPED',
  CHANGE_COMPLETED = 'CHANGE_COMPLETED',
  CHNAGE_OPTIONS = 'CHANGE_OPTIONS',
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

interface ChangeSkippedAction {
  type: Action.CHANGE_SKIPPED;
  payload: boolean;
}

interface ChangeCompletedAction {
  type: Action.CHANGE_COMPLETED;
  payload: boolean;
}

interface ChangeOptionsAction {
  type: Action.CHNAGE_OPTIONS;
  payload: Record<string, boolean>;
}

export type ActionType =
  | InitializeAction
  | ChangeSkippedAction
  | ChangeCompletedAction
  | ChangeOptionsAction;

interface CopilotState {
  skipped: boolean;
  completed: boolean;
  options: Record<string, boolean>;
}

interface CopilotContext extends CopilotState {
  initialize: () => void;
  changeSkipped: (payload: ChangeSkippedAction['payload']) => void;
  changeCompleted: (payload: ChangeCompletedAction['payload']) => void;
  changeOptions: (payload: ChangeOptionsAction['payload']) => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: CopilotState = {
  skipped: false,
  completed: false,
  options: {},
};

const [Provider, useCopilotContext] = createContext<CopilotContext>({
  name: 'useCopilotContext',
  errorMessage: 'useCopilotContext: "context" is undefined.',
  defaultValue: initialState as CopilotContext,
});

// eslint-disable-next-line @typescript-eslint/default-param-last
function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case Action.INITIALIZE: {
      return initialState;
    }
    case Action.CHANGE_SKIPPED: {
      return { ...state, skipped: action.payload };
    }
    case Action.CHANGE_COMPLETED: {
      return { ...state, completed: action.payload };
    }
    case Action.CHNAGE_OPTIONS: {
      return { ...state, options: action.payload };
    }
    default: {
      return state;
    }
  }
}

interface Props {
  children: React.ReactNode;
}

function CopilotProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = () => {
    dispatch({ type: Action.INITIALIZE });
  };

  const changeSkipped = (payload: ChangeSkippedAction['payload']) => {
    dispatch({ type: Action.CHANGE_SKIPPED, payload });
  };

  const changeCompleted = (payload: ChangeCompletedAction['payload']) => {
    dispatch({ type: Action.CHANGE_COMPLETED, payload });
  };

  const changeOptions = (payload: ChangeOptionsAction['payload']) => {
    dispatch({ type: Action.CHNAGE_OPTIONS, payload });
  };

  const actions = useMemo(
    () => ({
      ...state,
      initialize,
      changeSkipped,
      changeCompleted,
      changeOptions,
      dispatch,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { CopilotProvider, useCopilotContext };
