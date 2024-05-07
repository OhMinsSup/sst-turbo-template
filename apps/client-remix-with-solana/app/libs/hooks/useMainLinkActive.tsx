import { useLocation } from '@remix-run/react';

import type { NavItem, ScrollNavItem } from '~/constants/navigation';

interface UseMainLinkActiveOptions {
  item: NavItem;
}

export function useMainLinkActive({ item }: UseMainLinkActiveOptions) {
  const location = useLocation();

  const rootHref = item.href;
  const relationHrefs = new Set<string>();

  if (rootHref) {
    relationHrefs.add(rootHref);
  }

  if (item.relationHrefs) {
    item.relationHrefs.forEach((href) => relationHrefs.add(href));
  }

  const href =
    Array.from(relationHrefs).find((href) => href === location.pathname) ?? '#';

  const Icon = item.relationIcons?.[href] ?? item.icon;

  const isActive = relationHrefs.has(location.pathname);

  return {
    href: item.href ? item.href : '#',
    Icon,
    isActive,
  };
}

interface UseScrollNavLinkActiveOptions {
  item: ScrollNavItem;
}

export function useScrollNavLinkActive({
  item,
}: UseScrollNavLinkActiveOptions) {
  const location = useLocation();

  const isActive = item.href === location.pathname;

  return {
    isActive,
  };
}
