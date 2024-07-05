import React from "react";
import { Link } from "@remix-run/react";

import { cn } from "@template/ui";
import { buttonVariants } from "@template/ui/button";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

interface SignUpLayoutProps {
  children: React.ReactNode;
}

export default function SignUpLayout({ children }: SignUpLayoutProps) {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        unstable_viewTransition
        to={PAGE_ENDPOINTS.AUTH.SIGNIN}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        로그인
      </Link>
      <div className={cn("hidden h-full bg-muted lg:block")} />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.threads className="mx-auto size-8 fill-current" />
          </div>
          {children}
          <p
            className={cn(
              "space-x-3 px-8 text-center text-sm text-muted-foreground",
            )}
          >
            <Link
              to="/terms"
              className={cn("hover:text-brand underline underline-offset-4")}
            >
              Threads 약관
            </Link>
            <Link
              to="/privacy"
              className={cn("hover:text-brand underline underline-offset-4")}
            >
              개인정보처리방침
            </Link>
            <Link
              to="/cookie"
              className={cn("hover:text-brand underline underline-offset-4")}
            >
              쿠키정책
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
