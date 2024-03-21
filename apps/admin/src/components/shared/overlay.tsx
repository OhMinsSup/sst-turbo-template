import React, { useRef } from 'react';

import { getTargetElement } from '@template/react';
import { useEventListener } from '@template/react-hooks';
import { cn } from '@template/ui';

import { useAdminConfigStore } from '~/services/store/useAdminConfigStore';

export default function Overlay() {
  const $ele = useRef<HTMLDivElement>(null);
  const { isNavOpened, changeNavOpened } = useAdminConfigStore();

  useEventListener(
    'click',
    (e: Event) => {
      const ele = getTargetElement($ele);
      if (ele?.contains(e.target as Node)) {
        changeNavOpened(false);
      }
    },
    {
      target: $ele,
    },
  );

  return (
    <div
      ref={$ele}
      role="presentation"
      className={cn(
        'absolute inset-0 w-full bg-black transition-[opacity] delay-100 duration-700 md:hidden',
        isNavOpened ? 'h-svh opacity-50' : 'h-0 opacity-0',
      )}
    />
  );
}
