import { create } from 'zustand';

interface AdminConfigState {
  isCollapsed: boolean;
  isNavOpened: boolean;
}

interface AdminConfigActions {
  changeIsCollapsed: (isCollapsed: boolean) => void;
  changeNavOpened: (isNavOpened: boolean) => void;
}

type AdminConfigStore = AdminConfigState & AdminConfigActions;

export const useAdminConfigStore = create<AdminConfigStore>((set) => ({
  isCollapsed: false,
  isNavOpened: false,
  changeIsCollapsed: (isCollapsed) => {
    set({ isCollapsed });
  },
  changeNavOpened: (isNavOpened) => {
    set({ isNavOpened });
  },
}));
