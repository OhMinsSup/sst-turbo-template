import type { PersistStorage } from 'zustand/middleware';
import superjson from 'superjson'; //  can use anything: serialize-javascript, devalue, etc.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type IconType } from '~/components/icons';

export interface Navigation {
  id: string;
  title: string;
  href: string | ((...args: any[]) => string);
  matchHref: RegExp;
  depth: number;
  sub: Navigation[];
  icon?: IconType;
  label?: string;
  disabled?: boolean;
}

interface AdminNavigationState {
  navigations: Navigation[];
}

interface AdminNavigationActions {
  getNavigation: (pathname: string) => Navigation | null;
  getGroupLeaderNavigation: (pathname: string) => Navigation | null;
  getFlatNavigation: (pathname: string) => Navigation[];
}

type AdminNavigationStore = AdminNavigationState & AdminNavigationActions;

const initialNavigations: Navigation[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    label: 'This is a dashboard page.',
    matchHref: /^\/dashboard/,
    icon: 'dashboard',
    depth: 0,
    sub: [],
  },
  {
    id: 'settings',
    title: 'Settings',
    href: '/settings',
    label: 'This is a settings page.',
    icon: 'settings',
    matchHref: /^\/settings/,
    sub: [],
    depth: 0,
  },
  {
    id: 'profile',
    title: 'Profile',
    href: '/profile',
    label: 'This is a profile page.',
    icon: 'user',
    matchHref: /^\/profile/,
    sub: [],
    depth: 0,
  },
  {
    id: 'components',
    title: 'Components',
    label: 'This is a components page.',
    href: '/components',
    icon: 'component',
    matchHref: /^\/components/,
    sub: [
      {
        id: 'components-form',
        title: 'Form',
        icon: 'form',
        href: '/components/form',
        label: 'This is a form page.',
        matchHref: /^\/components\/form/,
        depth: 1,
        sub: [],
      },
      {
        id: 'components-editor',
        title: 'Editor',
        href: '/components/editor',
        label: 'This is a editor page.',
        icon: 'penLine',
        matchHref: /^\/components\/editor/,
        depth: 1,
        sub: [],
      },
      {
        id: 'components-table',
        title: 'Table',
        icon: 'table',
        href: '/components/table',
        label: 'This is a table page.',
        matchHref: /^\/components\/table/,
        depth: 1,
        sub: [],
      },
      {
        id: 'components-modal',
        title: 'Modal',
        icon: 'dialog',
        href: '/components/modal',
        label: 'This is a modal page.',
        matchHref: /^\/components\/modal/,
        depth: 1,
        sub: [],
      },
      {
        id: 'components-search',
        title: 'Search',
        icon: 'search',
        href: '/components/search',
        label: 'This is a search page.',
        matchHref: /^\/components\/search/,
        depth: 1,
        sub: [],
      },
    ],
    depth: 0,
  },
];

/**
 * @description pathname을 받아서 navigations에서 해당하는 navigation을 찾아서 반환합니다.
 * @param {Navigation[]} navigations
 * @param {string} pathname
 */
function recursiveFindNavigation(
  navigations: Navigation[],
  pathname: string,
): Navigation | null {
  for (const nav of navigations) {
    // 정확하게 일치하는 경우
    const exactMatch = nav.matchHref.exec(pathname);
    if (exactMatch && exactMatch[0] === pathname) {
      return nav;
    }

    // 하위에 있는 경우
    if (nav.sub.length > 0) {
      const found = recursiveFindNavigation(nav.sub, pathname);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * @description pathname을 받아서 해당하는 navigation group leader (트리 구조로된 배열에서 현재 위치한 곳에서 최상단의 배열을 의미)를 찾아서 반환합니다.
 * @param {Navigation[]} navigations
 * @param {string} pathname
 */
function recursiveFindRootGroupLeaderNavigation(
  navigations: Navigation[],
  pathname: string,
  targetDepth = 0,
): Navigation | null {
  const currentPositionItem = recursiveFindNavigation(navigations, pathname);

  if (!currentPositionItem) {
    return null;
  }

  const currentDepth = currentPositionItem.depth;
  let groupLeader: Navigation | null = null;

  // 현재 currentPositionItem을 포함한 그룹 리더를 찾는다.
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < navigations.length; i++) {
    const nav = navigations[i];

    // 현재 위치한 곳이거나 현재 위치한 곳의 하위에 있는 경우
    if (nav.depth <= currentDepth) {
      groupLeader = nav;
      break;
    }

    // 현재 위치한 곳의 상위에 있는 경우
    if (nav.sub.length > 0) {
      const found = recursiveFindRootGroupLeaderNavigation(
        nav.sub,
        pathname,
        targetDepth,
      );
      if (found) {
        groupLeader = found;
        break;
      }
    }
  }

  return groupLeader;
}

/**
 * @description pathname을 받아서 해당하는 navigation group을 찾아서 반환합니다.
 * @param {Navigation[]} navigations
 * @param {string} pathname
 */
function recursiveFlatNavigation(
  navigations: Navigation[],
  pathname: string,
): Navigation[] {
  const result: Navigation[] = [];

  for (const nav of navigations) {
    // 정확하게 일치하는 경우
    const exactMatch = nav.matchHref.exec(pathname);
    if (exactMatch && exactMatch[0] === pathname) {
      result.push(nav);
      return result;
    }

    // 하위에 있는 경우
    if (nav.sub.length > 0) {
      const found = recursiveFlatNavigation(nav.sub, pathname);
      if (found.length > 0) {
        result.push(nav);
        result.push(...found);
        return result;
      }
    }
  }

  return result;
}

const storage: PersistStorage<AdminNavigationStore> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;

    return superjson.parse(str);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useAdminNavigationStore = create<AdminNavigationStore>()(
  persist(
    (set, get) => ({
      navigations: initialNavigations,
      getNavigation: (pathname: string) => {
        return recursiveFindNavigation(get().navigations, pathname);
      },
      getGroupLeaderNavigation: (pathname: string) => {
        return recursiveFindRootGroupLeaderNavigation(
          get().navigations,
          pathname,
        );
      },
      getFlatNavigation: (pathname: string) => {
        return recursiveFlatNavigation(get().navigations, pathname);
      },
    }),
    {
      name: '@admin.navigation', // name of the item in the storage (must be unique)
      storage,
    },
  ),
);
