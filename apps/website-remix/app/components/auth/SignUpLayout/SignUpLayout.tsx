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
    <div className="z-50 mx-auto w-full max-w-[370px] py-16">
      {children}
      <div className="mt-6 space-y-5">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              또는
            </span>
          </div>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            to={PAGE_ENDPOINTS.AUTH.SIGNIN}
            viewTransition
            className="hover:text-brand underline underline-offset-4"
          >
            이미 계정이 있으신가요? 로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
