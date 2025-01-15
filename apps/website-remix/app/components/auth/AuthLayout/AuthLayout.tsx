import React from "react";
import { Link } from "@remix-run/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@template/ui/components/accordion";
import { Button } from "@template/ui/components/button";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS, SITE_CONFIG } from "~/constants/constants";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <div>
        <header className="fixed left-0 right-0 w-full">
          <div className="ml-5 mt-4 md:ml-10 md:mt-10">
            <Link to={PAGE_ENDPOINTS.ROOT} viewTransition>
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
                실시간 데이터베이스, 인증, 파일 저장 및 관리자 대시보드가
                <br />
                포함된 오픈 소스 백엔드
              </p>

              <div className="pointer-events-auto mb-6 mt-6 flex flex-col">
                {children}

                <Accordion
                  type="single"
                  collapsible
                  className="mt-6 border-t-[1px] pt-2"
                >
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="flex justify-center space-x-2 text-sm">
                      <span>더 많은 옵션</span>
                    </AccordionTrigger>
                    <AccordionContent className="mt-4">
                      <div className="flex flex-col space-y-4">
                        <Button variant="outline">
                          <Icons.GitHub className="mr-2 h-4 w-4" />
                          Github으로 로그인
                        </Button>
                        <Button variant="outline">
                          <Icons.Google className="mr-2 h-4 w-4" />
                          Google로 로그인
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
