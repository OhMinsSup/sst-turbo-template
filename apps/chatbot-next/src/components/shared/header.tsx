/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import { Button } from '@template/ui/button';

import { Icons } from '~/components/icons';

function UserOrLogin() {
  return (
    <Link href="/new" rel="nofollow">
      <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
    </Link>
  );
}

export function Header() {
  return (
    <header className="from-background/10 via-background/50 to-background/80 sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between bg-gradient-to-b px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <UserOrLogin />
        <div className="flex-1 overflow-auto" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button asChild size="sm" variant="ghost">
          <a
            target="_blank"
            href="https://github.com/vercel-labs/gemini-chatbot"
            rel="noopener noreferrer"
          >
            <Icons.github />
            <span className="ml-2 hidden md:flex">GitHub</span>
          </a>
        </Button>
        <Button asChild size="sm" className="gap-1 rounded-lg">
          <a
            href="https://vercel.com/templates/next.js/gemini-ai-chatbot"
            target="_blank"
            rel="noopener"
          >
            <Icons.vercel className="size-3" />
            <span className="hidden sm:block">Deploy to Vercel</span>
            <span className="sm:hidden">Deploy</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
