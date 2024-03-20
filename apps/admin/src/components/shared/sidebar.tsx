import { useCallback, useEffect, useState } from 'react';

import { cn, CustomButton } from '@template/ui';

import { Layout, LayoutHeader } from '~/components/shared/layout';
import { navigations } from '~/constants/navigations';
import { useAdminConfigStore } from '~/services/store/useAdminConfigStore';
import { Icons } from '../icons';
import Logo from './logo';
import Nav from './nav';

type SidebarProps = React.HTMLAttributes<HTMLElement>;

export default function Sidebar2({ className }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false);

  const { isCollapsed, changeIsCollapsed, isNavOpened, changeNavOpened } =
    useAdminConfigStore();

  const onToggleNav = useCallback(() => {
    changeNavOpened(!isNavOpened);
  }, [changeNavOpened, isNavOpened]);

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [navOpened]);

  return (
    <aside
      className={cn(
        'border-r-muted fixed left-0 right-0 top-0 z-50 w-full border-r-2 transition-[width] md:bottom-0 md:right-auto md:h-svh',
        isCollapsed ? 'md:w-14' : 'md:w-64',
        className,
      )}
    >
      {/* Overlay in mobile */}
      <div
        role="presentation"
        onClick={() => {
          setNavOpened(false);
        }}
        className={cn(
          'absolute inset-0 w-full bg-black transition-[opacity] delay-100 duration-700 md:hidden',
          isNavOpened ? 'h-svh opacity-50' : 'h-0 opacity-0',
        )}
      />

      <Layout>
        <LayoutHeader className="sticky top-0 justify-between px-4 py-3 shadow md:px-4">
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
            setNavOpened(false);
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
            stroke="1.5"
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </CustomButton>
      </Layout>
    </aside>
  );
}
