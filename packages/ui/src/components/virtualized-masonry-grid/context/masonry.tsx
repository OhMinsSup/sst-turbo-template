import { useMemo, useReducer } from "react";

import { createContext } from "../../../lib/context";
import { arePositionsEqual } from "../utils/helper";

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

export interface GridItemPosition {
  translateX: number;
  translateY: number;
  width: number;
  height: number;
}

enum Action {
  INITIALIZE = "INITIALIZE",
  CHANGE_CONTAINER_HEIGHT = "CHANGE_CONTAINER_HEIGHT",
  CHANGE_POSITIONS = "CHANGE_POSITIONS",
  CHANGE_VISIBLE_ITEMS = "CHANGE_VISIBLE_ITEMS",
  SET_FRIST_RENDER = "SET_FRIST_RENDER",
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

interface ChangeContainerHeightAction {
  type: Action.CHANGE_CONTAINER_HEIGHT;
  payload: number;
}

interface ChangePositionsAction {
  type: Action.CHANGE_POSITIONS;
  payload: GridItemPosition[];
}

interface ChangeVisibleItemsAction {
  type: Action.CHANGE_VISIBLE_ITEMS;
  payload: number[];
}

interface SetFristRenderAction {
  type: Action.SET_FRIST_RENDER;
  payload: boolean;
}

type ActionType =
  | InitializeAction
  | ChangeContainerHeightAction
  | ChangePositionsAction
  | ChangeVisibleItemsAction
  | SetFristRenderAction;

interface VirtualGridMasonryState {
  fristRender: boolean;
  viewport: Viewport;
  containerHeight: number;
  positions: GridItemPosition[];
  visibleItems: number[];
}

export const DEFAULT_COLUMNS = 3;

const initialState: VirtualGridMasonryState = {
  fristRender: false,
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
  containerHeight: 0,
  positions: [],
  visibleItems: [],
};

interface VirtualGridMasonryContext extends VirtualGridMasonryState {
  initialize: () => void;
  changeContainerHeight: (
    payload: ChangeContainerHeightAction["payload"],
  ) => void;
  changePositions: (payload: ChangePositionsAction["payload"]) => void;
  changeVisibleItems: (payload: ChangeVisibleItemsAction["payload"]) => void;
  setFristRender: (payload: SetFristRenderAction["payload"]) => void;
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
    case Action.CHANGE_CONTAINER_HEIGHT: {
      // 상태 업데이트 전에 이전 상태와 비교
      if (state.containerHeight !== action.payload) {
        return {
          ...state,
          containerHeight: action.payload,
        };
      }
      return state;
    }
    case Action.CHANGE_POSITIONS: {
      // 상태 업데이트 전에 이전 상태와 비교
      if (!arePositionsEqual(state.positions, action.payload)) {
        return {
          ...state,
          positions: action.payload,
        };
      }
      return state;
    }
    case Action.CHANGE_VISIBLE_ITEMS: {
      // 상태 업데이트 전에 이전 상태와 비교
      if (
        state.visibleItems.length !== action.payload.length ||
        !state.visibleItems.every((v, i) => v === action.payload[i])
      ) {
        return {
          ...state,
          visibleItems: action.payload,
        };
      }
      return state;
    }
    case Action.SET_FRIST_RENDER: {
      return {
        ...state,
        fristRender: action.payload,
      };
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

  const changeContainerHeight = (payload: number) =>
    dispatch({ type: Action.CHANGE_CONTAINER_HEIGHT, payload });

  const changePositions = (payload: GridItemPosition[]) =>
    dispatch({ type: Action.CHANGE_POSITIONS, payload });

  const changeVisibleItems = (payload: number[]) =>
    dispatch({ type: Action.CHANGE_VISIBLE_ITEMS, payload });

  const setFristRender = (payload: boolean) =>
    dispatch({ type: Action.SET_FRIST_RENDER, payload });

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      changeContainerHeight,
      changePositions,
      changeVisibleItems,
      setFristRender,
      initialize,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export type GridColumnsConfig = Partial<Viewport["breakpoints"]>;

export { VirtualGridMasonryProvider, useVirtualGridMasonryProvider };
