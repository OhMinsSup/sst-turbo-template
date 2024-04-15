import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AdminConfigState {
  isCollapsed: boolean;
  isNavOpened: boolean;
  showTopNavigation: boolean;
}

interface AdminConfigActions {
  changeIsCollapsed: (isCollapsed: boolean) => void;
  changeNavOpened: (isNavOpened: boolean) => void;
  changeTopNavigation: (showTopNavigation: boolean) => void;
}

type AdminConfigStore = AdminConfigState & AdminConfigActions;

export const useAdminConfigStore = create(
  persist<AdminConfigStore>(
    (set) => ({
      isCollapsed: false,
      isNavOpened: false,
      showTopNavigation: false,
      changeIsCollapsed: (isCollapsed) => {
        set({ isCollapsed });
      },
      changeNavOpened: (isNavOpened) => {
        set({ isNavOpened });
      },
      changeTopNavigation: (showTopNavigation) => {
        set({ showTopNavigation });
      },
    }),
    {
      name: '@admin.config', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
