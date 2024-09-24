import { Link } from "@remix-run/react";

import { cn } from "@template/ui";

import { Icons } from "~/components/icons";
import { NavigationMenu } from "~/components/shared/NavigationMenu";
import { Navigations } from "~/components/shared/Navigations";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { useHints } from "~/utils/client-hints";

export default function SiteHeader() {
  const hints = useHints();
  return (
    <header
      aria-label="Header"
      className={cn(
        "sticky top-0 z-[100] w-full",
        // isScrolled ? "dark:bg-[#101010D9] bg-background backdrop-blur-2xl" : "bg-transparent"
      )}
    >
      <nav className="px-4 sm:container sm:max-w-[1250px]">
        <div className="relative z-50 flex h-full max-h-[60px] w-full items-center justify-between py-1 sm:max-h-full">
          <Link
            to={PAGE_ENDPOINTS.ROOT}
            className="z-[50] flex w-full transform cursor-pointer items-center justify-center gap-2.5 py-4 text-2xl font-semibold tracking-wide transition-all duration-150 ease-out hover:scale-105 active:scale-95 sm:w-fit"
          >
            <Icons.logo className="h-[34px] w-[34px]" />
          </Link>
          <div className="hidden w-full max-w-[480px] items-center justify-between sm:flex">
            <Navigations />
          </div>
          {hints.device === "mobile" ? (
            <div className="absolute right-0 top-2/4 z-[999] -translate-y-2/4">
              <NavigationMenu />
            </div>
          ) : (
            <NavigationMenu />
          )}
        </div>
      </nav>
    </header>
  );
}
