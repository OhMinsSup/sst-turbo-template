'use client';

import React, { useCallback } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@template/ui/button';

import { Icons } from '~/components/icons';

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme();

  const onClick = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className="rounded-full"
      onClick={onClick}
    >
      {theme === 'light' ? (
        <Icons.moon className="size-4" />
      ) : (
        <Icons.sun className="size-4" />
      )}
    </Button>
  );
}
