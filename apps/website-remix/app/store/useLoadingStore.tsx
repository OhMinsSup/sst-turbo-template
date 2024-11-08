import { create } from "zustand";

type LoadingState = "idle" | "loading";

type State = {
  loadingState: LoadingState;
};

type Action = {
  setLoadingState: (loadingState: LoadingState) => void;
};

export const useLoadingStore = create<State & Action>((set) => ({
  loadingState: "idle",
  setLoadingState: (loadingState) => set({ loadingState }),
}));
