'use client';

import { useTransition } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@template/ui/button';

import { Icons } from '~/components/icons';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [_, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === 'light' ? 'dark' : 'light');
        });
      }}
    >
      {!theme ? null : theme === 'dark' ? (
        <Icons.moon className="transition-all" />
      ) : (
        <Icons.sun className="transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
