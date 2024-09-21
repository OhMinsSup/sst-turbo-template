import React from "react";
import { Link, useLocation } from "@remix-run/react";

import { cn } from "@template/ui";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function Navigations() {
  const location = useLocation();
  return (
    <>
      <Link
        to={PAGE_ENDPOINTS.ROOT}
        unstable_viewTransition
        className="flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 hover:bg-slate-50 active:scale-90 sm:px-8 sm:py-5"
      >
        <Icons.home2
          className={cn(
            "h-[26px] w-[26px] text-lg",
            location.pathname === "/" ? "text-foreground" : "text-secondary",
          )}
          stroke="red"
          fill={location.pathname === "/" ? "currentColor" : "transparent"}
        />
      </Link>
      <Link
        to={"/search"}
        unstable_viewTransition
        className="flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 hover:bg-slate-50 active:scale-90 sm:px-8 sm:py-5"
      >
        <Icons.search2
          className={cn(
            "h-6 w-6 text-lg",
            location.pathname === "/search"
              ? "text-foreground"
              : "text-slate-300",
          )}
        />
      </Link>
      {/* <CreatePostCard /> */}
      <Link
        to={"/activity"}
        unstable_viewTransition
        className="flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 hover:bg-slate-50 active:scale-90 sm:px-8 sm:py-5"
      >
        <Icons.activity
          className={cn(
            "h-[26px] w-[26px]",
            location.pathname === "/activity"
              ? "text-foreground"
              : "text-slate-300",
          )}
          fill={
            location.pathname === "/activity" ? "currentColor" : "transparent"
          }
        />
      </Link>
      <Link
        // to={`/@${user?.username}`}
        to={"/"}
        unstable_viewTransition
        className="flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 hover:bg-slate-50 active:scale-90 sm:px-8 sm:py-5"
      >
        <Icons.profile
          className={cn(
            "h-[26px] w-[26px]",
            location.pathname.match(/^\/@\w+$/)
              ? "text-foreground"
              : "text-slate-300",
          )}
          fill={
            location.pathname.match(/^\/@\w+$/) ? "currentColor" : "transparent"
          }
        />
      </Link>
    </>
  );
}
