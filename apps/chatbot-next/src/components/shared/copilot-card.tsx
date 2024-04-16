import React from 'react';

import { cn } from '@template/ui/utils';

interface CopilotCardProps {
  showAvatar?: boolean;
  children: React.ReactNode;
}

export function CopilotCard({ showAvatar, children }: CopilotCardProps) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          'bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm',
          !showAvatar && 'invisible',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}
