import { create } from "zustand";

import { uuid } from "~/libs/id";

interface State {
  __prevSubmitId: string | null;
  __submitId: string | null;
}

interface Action {
  resetSubmitId: () => void;
  generateSubmitId: () => string;
  submitId: () => string | null;
}

export const useDataStore = create<State & Action>((set, get) => ({
  __prevSubmitId: null,
  __submitId: null,
  generateSubmitId: () => {
    const oldSubmitId = get().__submitId;
    if (oldSubmitId) {
      set({ __prevSubmitId: oldSubmitId });
    }
    const nextSubmitId = uuid();
    set({ __submitId: nextSubmitId });
    return nextSubmitId;
  },
  resetSubmitId: () => set({ __submitId: null, __prevSubmitId: null }),
  submitId: () => get().__submitId,
}));
