'use client';

import { useEffect } from 'react';

import { cn } from '@template/ui/utils';

import Sidebar from '~/components/shared/sidebar';
import { useAdminConfigStore } from '~/services/store/useAdminConfigStore';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isCollapsed } = useAdminConfigStore();

  useEffect(() => {
    return useAdminConfigStore.subscribe((state) => {
      if (state.isNavOpened) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    });
  }, []);

  return (
    <div className="bg-background relative h-full overflow-hidden">
      <Sidebar />
      <main
        id="main-content"
        className={cn(
          'h-full overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0',
          isCollapsed ? 'md:ml-14' : 'md:ml-64',
        )}
      >
        {children}
      </main>
    </div>
  );
}
