'use client';

import * as React from 'react';

import type { ButtonProps } from '@template/ui/button';
import { Button } from '@template/ui/button';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';

interface ButtonScrollToBottomProps extends ButtonProps {
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ButtonScrollToBottom({
  className,
  isAtBottom,
  scrollToBottom,
  ...props
}: ButtonScrollToBottomProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'bg-background absolute -top-10 right-4 z-10 transition-opacity duration-300 sm:right-8 md:top-2',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className,
      )}
      onClick={() => {
        scrollToBottom();
      }}
      {...props}
    >
      <Icons.chevronDown />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}
