'use client';

import React from 'react';

import { ModeToggle } from '~/components/chatbot/mode-toggle';
import { Icons } from '~/components/icons';

export function Header() {
  return (
    <header className="bg-background/80 fixed z-10 flex w-full items-center justify-between p-0 backdrop-blur md:bg-transparent md:p-2 md:backdrop-blur-none">
      <div className="p-2">
        <a href="/">
          <Icons.logo className="size-5" />
          <span className="sr-only">Morphic</span>
        </a>
      </div>
      <ModeToggle />
    </header>
  );
}

export default Header;
