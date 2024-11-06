import React from "react";
import { Link } from "@remix-run/react";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS, SITE_CONFIG } from "~/constants/constants";

interface SignInLayoutProps {
  children: React.ReactNode;
}

export default function SignInLayout({ children }: SignInLayoutProps) {
  return (
    <>
      <div>
        <header className="fixed left-0 right-0 w-full">
          <div className="ml-5 mt-4 md:ml-10 md:mt-10">
            <Link to={PAGE_ENDPOINTS.ROOT}>
              <Icons.Logo width={112} height={28} />
            </Link>
          </div>
        </header>
        <div className="flex min-h-screen items-center justify-center overflow-hidden p-6 md:p-0">
          <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
            <div className="relative flex w-full flex-col">
              <div className="inline-block bg-gradient-to-r from-primary to-[#000] bg-clip-text pb-4 text-transparent dark:via-primary dark:to-[#848484]">
                <h1 className="pb-1 text-3xl font-medium">
                  {SITE_CONFIG.title}
                  <br /> 로그인
                </h1>
              </div>

              <p className="pb-1 text-2xl font-medium text-[#878787]">
                {SITE_CONFIG.title}은 <br />
                Remix를 사용하여 <br />
                어드민 구조를 쉽게 만들기 위해 <br />
                제작되었습니다.
              </p>

              <div className="pointer-events-auto mb-6 mt-6 flex flex-col">
                {children}
                <p className="px-8 py-3 text-center text-xs text-muted-foreground">
                  <Link
                    to={PAGE_ENDPOINTS.AUTH.SIGNIN}
                    viewTransition
                    className="hover:text-brand underline underline-offset-4"
                  >
                    이미 계정이 있으신가요? 로그인
                  </Link>
                </p>
              </div>

              <p className="text-xs text-[#878787]">
                계속을 클릭하면 {SITE_CONFIG.title} 의{" "}
                <a href="https://midday.ai/terms" className="underline">
                  서비스 약관
                </a>{" "}
                및{" "}
                <a href="https://midday.ai/policy" className="underline">
                  개인정보 보호정책
                </a>
                에 동의하는 것으로 간주됩니다. .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
