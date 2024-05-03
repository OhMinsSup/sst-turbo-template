import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SidebarState {
  isSidebarOpen: boolean;
  isLoading: boolean;
}

interface SidebarActions {
  toggleSidebar: () => void;
  changeSidebar: (isSidebarOpen: boolean) => void;
  changeLoading: (isLoading: boolean) => void;
}

type SidebarStore = SidebarState & SidebarActions;

export const useSidebarStore = create(
  persist<SidebarStore>(
    (set) => ({
      isSidebarOpen: true,
      isLoading: true,
      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      changeSidebar: (isSidebarOpen) => {
        set({ isSidebarOpen });
      },
      changeLoading: (isLoading) => {
        set({ isLoading });
      },
    }),
    {
      name: '@chatbot.sidebar', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
