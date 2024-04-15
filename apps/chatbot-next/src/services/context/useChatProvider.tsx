/* eslint-disable @typescript-eslint/naming-convention */
import React, { useMemo, useReducer } from 'react';

import { createContext } from '@template/react-hooks/context';

export type FilterType = 'ADD' | 'REMOVE' | 'NONE';

enum Action {
  INITIALIZE = 'INITIALIZE',
  CHANGE_INPUT = 'CHANGE_INPUT',
  CHANGE_DIALOG_STATE = 'CHANGE_DIALOG_STATE',
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

interface ChangeDialogStateAction {
  type: Action.CHANGE_DIALOG_STATE;
  payload: {
    key: keyof DialogState;
    value: boolean;
  };
}

export type ActionType =
  | InitializeAction
  | ChangeInputAction
  | ChangeDialogStateAction;

interface DialogState {
  share: boolean;
}

interface ChatState {
  input: string;
  dialog: DialogState;
}

interface ChatContext extends ChatState {
  initialize: () => void;
  changeInput: (payload: ChangeInputAction['payload']) => void;
  changeDialogState: (payload: ChangeDialogStateAction['payload']) => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: ChatState = {
  input: '',
  dialog: {
    share: false,
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
    case Action.CHANGE_DIALOG_STATE: {
      return {
        ...state,
        dialog: {
          ...state.dialog,
          [action.payload.key]: action.payload.value,
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

  const changeDialogState = (payload: ChangeDialogStateAction['payload']) => {
    dispatch({ type: Action.CHANGE_DIALOG_STATE, payload });
  };

  const actions = useMemo(
    () => ({
      ...state,
      initialize,
      changeInput,
      changeDialogState,
      dispatch,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { ChatProvider, useChatContext };
