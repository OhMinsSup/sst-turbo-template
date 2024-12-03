import type { Path } from "@remix-run/react";
import { Link } from "@remix-run/react";

import { buttonVariants } from "@template/ui/components/button";
import { useSidebar } from "@template/ui/components/sidebar";
import { cn } from "@template/ui/lib";

import { Icons } from "~/components/icons";

export interface SidebarLogoProps {
  to: string | Partial<Path>;
}

export default function SidebarLogo({ to }: SidebarLogoProps) {
  const { open } = useSidebar();
  return (
    <Link
      viewTransition
      to={to}
      replace
      data-open={open}
      className={cn(
        buttonVariants({
          variant: "link",
        }),
        "items-center justify-start p-2",
      )}
    >
      <Icons.Logo
        data-open={open}
        className="data-[open=true]:mr-2 data-[open=true]:size-8 data-[open=false]:!w-full"
      />
    </Link>
  );
}
