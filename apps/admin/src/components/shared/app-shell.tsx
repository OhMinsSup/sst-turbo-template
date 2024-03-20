'use client';

import { cn } from '@template/ui';

import { useAdminConfigStore } from '~/services/store/useAdminConfigStore';
import Sidebar from './sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isCollapsed } = useAdminConfigStore();
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
