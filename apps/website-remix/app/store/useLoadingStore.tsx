import { create } from "zustand";

type LoadingState = "idle" | "loading";

interface State {
  loadingState: LoadingState;
}

interface Action {
  setLoadingState: (loadingState: LoadingState) => void;
}

export const useLoadingStore = create<State & Action>((set) => ({
  loadingState: "idle",
  setLoadingState: (loadingState) => set({ loadingState }),
}));
