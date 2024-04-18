import React from 'react';

import { cn } from '@template/ui/utils';

interface UserMessageProps {
  message: string;
  isFirstMessage?: boolean;
}

export function UserMessage({ message, isFirstMessage }: UserMessageProps) {
  return (
    <div className={cn({ 'pt-4': !isFirstMessage })}>
      <div className="text-xl">{message}</div>
    </div>
  );
}
