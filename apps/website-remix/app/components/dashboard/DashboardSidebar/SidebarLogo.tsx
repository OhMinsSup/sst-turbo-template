import { Link } from "@remix-run/react";

import { buttonVariants } from "@template/ui/components/button";
import { useSidebar } from "@template/ui/components/sidebar";
import { cn } from "@template/ui/lib";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export function SidebarLogo() {
  const { open } = useSidebar();
  return (
    <Link
      viewTransition
      to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT}
      replace
      className={cn(
        buttonVariants({
          variant: "link",
        }),
        "items-center justify-start p-2",
      )}
    >
      <Icons.Logo
        className={cn({
          "!w-full": !open,
          "mr-2 size-8": open,
        })}
      />
    </Link>
  );
}
