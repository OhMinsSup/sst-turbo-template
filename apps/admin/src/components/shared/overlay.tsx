import React from 'react';

import { cn } from '@template/ui';

import { useAdminConfigStore } from '~/services/store/useAdminConfigStore';

export default function Overlay() {
  const { isNavOpened, changeNavOpened } = useAdminConfigStore();

  return (
    <div
      role="presentation"
      onClick={() => {
        // setNavOpened(false);
      }}
      className={cn(
        'absolute inset-0 w-full bg-black transition-[opacity] delay-100 duration-700 md:hidden',
        isNavOpened ? 'h-svh opacity-50' : 'h-0 opacity-0',
      )}
    />
  );
}
