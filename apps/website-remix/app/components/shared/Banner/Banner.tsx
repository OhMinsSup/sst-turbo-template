import React from "react";

import { Icons } from "~/components/icons";
import { SITE_CONFIG } from "~/constants/constants";
import { useHints } from "~/utils/client-hints";

export default function Banner() {
  const hints = useHints();
  return (
    <header className="mx-auto max-w-screen-md md:max-w-screen-2xl lg:max-w-[1800px]">
      {hints.device === "mobile" ? (
        <div className="flex items-center justify-center">
          <Icons.logo className="mb-6 mt-16 h-10 w-10 sm:h-16 sm:w-16" />
        </div>
      ) : (
        <nav className="pointer-events-none z-50 flex w-full select-none items-center justify-between">
          <img
            width={1000}
            height={1000}
            src={SITE_CONFIG.backgroundImage}
            alt="Background"
            className="h-[500px] w-full object-cover"
          />
        </nav>
      )}
    </header>
  );
}
