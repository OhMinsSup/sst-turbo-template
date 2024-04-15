'use client';

import { useCallback } from 'react';

import { CustomButton } from '@template/ui/custom-button';
import { Layout, LayoutHeader } from '@template/ui/layout';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';
import Logo from '~/components/shared/logo';
import Nav from '~/components/shared/nav';
import Overlay from '~/components/shared/overlay';
import { useAdminConfigStore } from '~/services/store/useAdminConfigStore';
import { useAdminNavigationStore } from '~/services/store/useAdminNavigationStore';

type SidebarProps = React.HTMLAttributes<HTMLElement>;

export default function Sidebar({ className }: SidebarProps) {
  const { isCollapsed, changeIsCollapsed, isNavOpened, changeNavOpened } =
    useAdminConfigStore();

  const { navigations } = useAdminNavigationStore();

  const onToggleNav = useCallback(() => {
    changeNavOpened(!isNavOpened);
  }, [changeNavOpened, isNavOpened]);

  return (
    <aside
      className={cn(
        'border-r-muted fixed left-0 right-0 top-0 z-50 w-full border-r-2 transition-[width] md:bottom-0 md:right-auto md:h-svh',
        isCollapsed ? 'md:w-14' : 'md:w-64',
        className,
      )}
    >
      {/* Overlay in mobile */}
      <Overlay />
      <Layout>
        <LayoutHeader className="sticky top-0 justify-between px-4 py-3 shadow md:px-4 md:shadow-none">
          <Logo />
          {/* Toggle Button in mobile */}
          <CustomButton
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={isNavOpened}
            onClick={onToggleNav}
          >
            {isNavOpened ? <Icons.close /> : <Icons.menu />}
          </CustomButton>
        </LayoutHeader>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`h-full flex-1 overflow-auto ${isNavOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'}`}
          closeNav={() => {
            changeNavOpened(false);
          }}
          isCollapsed={isCollapsed}
          links={navigations}
        />

        {/* Scrollbar width toggle button */}
        <CustomButton
          onClick={() => {
            changeIsCollapsed(!isCollapsed);
          }}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 hidden rounded-full md:inline-flex"
        >
          <Icons.chevronLeft
            stroke="currentColor"
            strokeWidth="1.5"
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </CustomButton>
      </Layout>
    </aside>
  );
}
