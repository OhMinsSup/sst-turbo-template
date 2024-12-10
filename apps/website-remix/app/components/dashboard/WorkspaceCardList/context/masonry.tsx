import { useMemo, useReducer } from "react";

import { createContext } from "@template/ui/lib";

export interface MediaQueries {
  mobile: string;
  tablet: string;
  laptop: string;
  desktop: string;
  largeScreen: string;
}

export interface Breakpoint {
  mobile: number;
  tablet: number;
  laptop: number;
  desktop: number;
  largeScreen: number;
}

export type BreakpointKey = keyof Breakpoint;

export interface Viewport {
  mediaQueries: MediaQueries;
  breakpoints: Breakpoint;
}

enum Action {
  INITIALIZE = "INITIALIZE",
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

type ActionType = InitializeAction;

interface VirtualGridMasonryState {
  viewport: Viewport;
}

export const DEFAULT_COLUMNS = 3;

const initialState: VirtualGridMasonryState = {
  viewport: {
    mediaQueries: {
      mobile: "(max-width: 640px)",
      tablet: "(min-width: 768px)",
      laptop: "(min-width: 1024px)",
      desktop: "(min-width: 1280px)",
      largeScreen: "(min-width: 1536px)",
    },
    breakpoints: {
      mobile: 0, // include mobile for consistency
      tablet: 768,
      laptop: 1024,
      desktop: 1280,
      largeScreen: 1536,
    },
  },
};

interface VirtualGridMasonryContext extends VirtualGridMasonryState {
  initialize: () => void;
  dispatch: React.Dispatch<ActionType>;
}

const [Provider, useVirtualGridMasonryProvider] =
  createContext<VirtualGridMasonryContext>({
    name: "useVirtualGridMasonryProvider",
    errorMessage: 'useVirtualGridMasonryProvider: "context" is undefined.',
    defaultValue: initialState,
  });

function reducer(
  state = initialState,
  action: ActionType,
): VirtualGridMasonryState {
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

function VirtualGridMasonryProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = () => dispatch({ type: Action.INITIALIZE });

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      initialize,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export type GridColumnsConfig = Partial<Viewport["breakpoints"]>;

export { VirtualGridMasonryProvider, useVirtualGridMasonryProvider };
