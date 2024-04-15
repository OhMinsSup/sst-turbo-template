'use client';

import * as React from 'react';

import { cn } from '@template/ui/utils';

import { useSidebarStore } from '~/services/store/useSidebarStore';

export type SidebarProps = React.ComponentProps<'div'>;

export function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebarStore();

  return (
    <div
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(className, 'h-full flex-col dark:bg-zinc-950')}
    >
      {children}
    </div>
  );
}
