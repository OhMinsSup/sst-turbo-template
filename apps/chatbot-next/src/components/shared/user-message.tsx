import React from 'react';

import { Icons } from '~/components/icons';

interface UserMessageProps {
  children: React.ReactNode;
}

export function UserMessage({ children }: UserMessageProps) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm">
        <Icons.user />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  );
}
