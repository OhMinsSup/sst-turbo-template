import React from "react";
import { Link } from "@remix-run/react";
import { getYear } from "date-fns";

export default function SiteFooter() {
  return (
    <footer className="fixed bottom-8 mx-auto w-full max-w-screen-md md:max-w-screen-2xl lg:max-w-full">
      <ul className="flex flex-wrap justify-center gap-4 text-center text-xs">
        <li>
          <div className="cursor-text text-muted-foreground">
            © {getYear(new Date())}
          </div>
        </li>
        <li>
          <a
            role="link"
            target="_blank"
            tabIndex={0}
            href="https://help.instagram.com/769983657850450"
            className="cursor-pointer text-muted-foreground hover:underline hover:underline-offset-4 hover:opacity-75"
          >
            Threads 약관
          </a>
        </li>

        <li>
          <a
            role="link"
            target="_blank"
            tabIndex={0}
            href="https://help.instagram.com/515230437301944"
            className="cursor-pointer text-muted-foreground hover:underline hover:underline-offset-4 hover:opacity-75"
          >
            개인정보처리방침
          </a>
        </li>

        <li>
          <a
            role="link"
            target="_blank"
            tabIndex={0}
            href="https://privacycenter.instagram.com/policies/cookies/"
            className="cursor-pointer text-muted-foreground hover:underline hover:underline-offset-4 hover:opacity-75"
          >
            쿠키 정책
          </a>
        </li>
        <li>
          <div
            tabIndex={0}
            role="button"
            aria-pressed="false"
            className="cursor-pointer text-muted-foreground hover:underline hover:underline-offset-4 hover:opacity-75"
          >
            문제 신고
          </div>
        </li>
      </ul>
    </footer>
  );
}
