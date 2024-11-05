import React from "react";
import { Link } from "@remix-run/react";

import { OAuth } from "~/components/auth/OAuth";
import { PAGE_ENDPOINTS } from "~/constants/constants";

interface SignInLayoutProps {
  children: React.ReactNode;
}

export default function SignInLayout({ children }: SignInLayoutProps) {
  return (
    <div className="z-50 mx-auto w-full max-w-[370px] py-16">
      {children}
      <div className="text-center">
        <Link to="/" viewTransition className="text-sm text-muted-foreground">
          비밀번호를 잊으셨나요?
        </Link>
      </div>
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
        <OAuth />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            to={PAGE_ENDPOINTS.AUTH.SIGNUP}
            viewTransition
            className="hover:text-brand underline underline-offset-4"
          >
            아직 계정이 없으신가요? 회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
