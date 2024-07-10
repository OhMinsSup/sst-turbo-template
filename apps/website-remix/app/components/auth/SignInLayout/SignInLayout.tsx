import React from "react";
import { Link } from "@remix-run/react";

import { cn } from "@template/ui";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

interface SignInLayoutProps {
  children: React.ReactNode;
}

export default function SignInLayout({ children }: SignInLayoutProps) {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.threads className="mx-auto size-8 fill-current" />
        </div>
        {children}
        <p className={cn("px-8 text-center text-sm text-muted-foreground")}>
          <Link
            to={PAGE_ENDPOINTS.AUTH.SIGNUP}
            unstable_viewTransition
            className={cn("hover:text-brand underline underline-offset-4")}
          >
            아직 계정이 없으신가요? 회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
