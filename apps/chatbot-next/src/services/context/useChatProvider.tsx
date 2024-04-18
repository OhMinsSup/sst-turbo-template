/* eslint-disable @typescript-eslint/naming-convention */
import React, { useMemo, useReducer } from 'react';

import { createContext } from '@template/react-hooks/context';

export type FilterType = 'ADD' | 'REMOVE' | 'NONE';

enum Action {
  INITIALIZE = 'INITIALIZE',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_SCREEN_STATE = 'CHANGE_SCREEN_STATE',
  CHANGE_ASK_SCREEN_STATE = 'CHANGE_ASK_SCREEN_STATE',
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

interface ChangeInputAction {
  type: Action.CHANGE_INPUT;
  payload: {
    input: string;
  };
}

interface ChangeScreenStateAction {
  type: Action.CHANGE_SCREEN_STATE;
  payload: {
    key: keyof ScreenState;
    value: boolean;
  };
}

interface ChangeAskScreenStateAction {
  type: Action.CHANGE_ASK_SCREEN_STATE;
  payload: {
    value: boolean;
  };
}

export type ActionType =
  | InitializeAction
  | ChangeInputAction
  | ChangeScreenStateAction
  | ChangeAskScreenStateAction;

interface ScreenState {
  empty: boolean;
  ask: boolean;
}

interface ChatState {
  input: string;
  screen: ScreenState;
}

interface ChatContext extends ChatState {
  initialize: () => void;
  changeInput: (payload: ChangeInputAction['payload']) => void;
  changeScreenState: (payload: ChangeScreenStateAction['payload']) => void;
  changeAskScreenState: (
    payload: ChangeAskScreenStateAction['payload'],
  ) => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: ChatState = {
  input: '',
  screen: {
    ask: false,
    empty: false,
  },
};

const [Provider, useChatContext] = createContext<ChatContext>({
  name: 'useChatContext',
  errorMessage: 'useChatContext: "context" is undefined.',
  defaultValue: initialState as ChatContext,
});

// eslint-disable-next-line @typescript-eslint/default-param-last
function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case Action.INITIALIZE: {
      return initialState;
    }
    case Action.CHANGE_INPUT: {
      return {
        ...state,
        input: action.payload.input,
      };
    }
    case Action.CHANGE_SCREEN_STATE: {
      return {
        ...state,
        screen: {
          ...state.screen,
          [action.payload.key]: action.payload.value,
        },
      };
    }
    case Action.CHANGE_ASK_SCREEN_STATE: {
      return {
        ...state,
        screen: {
          ...state.screen,
          empty: false,
          ask: action.payload.value,
        },
      };
    }
    default: {
      return state;
    }
  }
}

interface Props {
  children: React.ReactNode;
}

function ChatProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = () => {
    dispatch({ type: Action.INITIALIZE });
  };

  const changeInput = (payload: ChangeInputAction['payload']) => {
    dispatch({ type: Action.CHANGE_INPUT, payload });
  };

  const changeScreenState = (payload: ChangeScreenStateAction['payload']) => {
    dispatch({ type: Action.CHANGE_SCREEN_STATE, payload });
  };

  const changeAskScreenState = (
    payload: ChangeAskScreenStateAction['payload'],
  ) => {
    dispatch({ type: Action.CHANGE_ASK_SCREEN_STATE, payload });
  };

  const actions = useMemo(
    () => ({
      ...state,
      initialize,
      changeInput,
      changeAskScreenState,
      changeScreenState,
      dispatch,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { ChatProvider, useChatContext };
