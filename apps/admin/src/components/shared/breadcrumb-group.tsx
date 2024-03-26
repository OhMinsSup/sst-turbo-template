'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@template/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@template/ui/dropdown-menu';

import type { Navigation } from '~/services/store/useAdminNavigationStore';
import { useAdminNavigationStore } from '~/services/store/useAdminNavigationStore';

export default function BreadcrumbGroup() {
  const pathname = usePathname();
  const { getNavigation } = useAdminNavigationStore();

  const navigation = useMemo(
    () => getNavigation(pathname),
    [getNavigation, pathname],
  );

  return (
    <div className="flex items-center justify-between space-y-2">
      <BreadcrumbGroup.Title navigation={navigation} />
      <div className="flex items-center">
        <BreadcrumbGroup.Breadcrumbs navigation={navigation} />
      </div>
    </div>
  );
}

interface BreadcrumbGroupProps {
  navigation: Navigation | null;
}

BreadcrumbGroup.Title = function Item({ navigation }: BreadcrumbGroupProps) {
  return (
    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
      {navigation?.title}
    </h1>
  );
};

BreadcrumbGroup.Breadcrumbs = function Item({}: BreadcrumbGroupProps) {
  const pathname = usePathname();
  const { getFlatNavigation } = useAdminNavigationStore();

  const flatNavigation = useMemo(
    () => getFlatNavigation(pathname),
    [pathname, getFlatNavigation],
  );

  const breadcrumbs = useMemo(() => {
    if (flatNavigation.length > 4) {
      const root = flatNavigation.at(0);
      const others = [...flatNavigation].slice(1, flatNavigation.length - 1);
      const last = flatNavigation.at(-1);
      return {
        mode: 'split',
        root,
        others,
        last,
      };
    }
    return {
      mode: 'default',
      root: null,
      others: flatNavigation,
      last: null,
    };
  }, [flatNavigation]);

  return (
    <Breadcrumb>
      {breadcrumbs.mode === 'split' ? (
        <BreadcrumbList>
          {breadcrumbs.root ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink>{breadcrumbs.root.title}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : null}
          {breadcrumbs.root &&
          breadcrumbs.last &&
          breadcrumbs.others.length > 1 ? (
            <>
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbs.others.map((nav) => {
                      return (
                        <DropdownMenuItem
                          key={`breadcrumb-${breadcrumbs.mode}-${nav.id}`}
                        >
                          {nav.title}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : null}
          {breadcrumbs.last ? (
            <BreadcrumbPage>{breadcrumbs.last.title}</BreadcrumbPage>
          ) : null}
        </BreadcrumbList>
      ) : (
        <BreadcrumbList>
          {breadcrumbs.others.map((nav, index) => {
            const isLast = index === breadcrumbs.others.length - 1;

            if (isLast) {
              return (
                <BreadcrumbItem
                  key={`breadcrumb-${breadcrumbs.mode}-${nav.id}`}
                >
                  <BreadcrumbPage>{nav.title}</BreadcrumbPage>
                </BreadcrumbItem>
              );
            }
            return (
              <React.Fragment key={`breadcrumb-${breadcrumbs.mode}-${nav.id}`}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">{nav.title}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      )}
    </Breadcrumb>
  );
};
