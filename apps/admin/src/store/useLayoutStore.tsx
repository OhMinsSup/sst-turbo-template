import { create } from 'zustand';
import { createSelectors } from './createSelectors';

interface LayoutState {
  currentDevice: 'desktop' | 'tablet' | 'mobile';
  isTablet: () => boolean;
}

const useLayoutStoreBase = create<LayoutState>()((set, get) => ({
  currentDevice: 'desktop',
  isTablet: () => {
    const { currentDevice } = get();
    return currentDevice === 'tablet';
  },
}));

export const useLayoutStore = createSelectors(useLayoutStoreBase);
