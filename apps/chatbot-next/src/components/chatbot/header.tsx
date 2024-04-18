'use client';

import React from 'react';

import { ModeToggle } from '~/components/chatbot/mode-toggle';

export function Header() {
  return (
    <header className="bg-background/80 fixed z-10 flex w-full items-center justify-between p-0 backdrop-blur md:bg-transparent md:p-2 md:backdrop-blur-none">
      <div className="p-2">
        <a href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
          <span className="sr-only">Morphic</span>
        </a>
      </div>
      <ModeToggle />
    </header>
  );
}

export default Header;
