'use client';

import React from 'react';

import { ClientOnly } from '@template/react-components';
import { cn } from '@template/ui/utils';

import { useAdminConfigStore } from '~/services/store/useAdminConfigStore';

export default function Logo() {
  const { isCollapsed } = useAdminConfigStore();
  return (
    <div
      className={cn('flex items-center', !isCollapsed ? 'gap-2' : undefined)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className={`transition-all ${isCollapsed ? 'h-6 w-6' : 'h-8 w-8'}`}
      >
        <rect width="256" height="256" fill="none" />
        <line
          x1="208"
          y1="128"
          x2="128"
          y2="208"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
        <line
          x1="192"
          y1="40"
          x2="40"
          y2="192"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
        <ClientOnly>
          <span className="sr-only">Website Name</span>
        </ClientOnly>
      </svg>
      <div
        className={cn(
          'flex flex-col justify-end truncate',
          isCollapsed ? 'invisible w-0' : 'visible w-auto',
        )}
      >
        <span className="font-medium">Shadcn Admin</span>
        <span className="text-xs">Vite + ShadcnUI</span>
      </div>
    </div>
  );
}

Logo.Icon = function Item() {
  const { isCollapsed } = useAdminConfigStore();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn('transition-all', isCollapsed ? 'h-6 w-6' : 'h-8 w-8')}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <ClientOnly>
        <span className="sr-only">Website Name</span>
      </ClientOnly>
    </svg>
  );
};
