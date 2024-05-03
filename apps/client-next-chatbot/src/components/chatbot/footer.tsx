import React from 'react';
import Link from 'next/link';

import { Button } from '@template/ui/button';

export function Footer() {
  return (
    <footer className="fixed bottom-0 right-0 w-fit p-1 md:p-2">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground/50"
        >
          <Link href="https://discord.gg/zRxaseCuGq" target="_blank">
            {/* <SiDiscord size={18} /> */}
            Discord
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground/50"
        >
          <Link href="https://twitter.com/miiura" target="_blank">
            {/* <SiTwitter size={18} /> */}
            Twitter
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground/50"
        >
          <Link href="https://git.new/morphic" target="_blank">
            {/* <SiGithub size={18} /> */}
            GitHub
          </Link>
        </Button>
      </div>
    </footer>
  );
}

export default Footer;
