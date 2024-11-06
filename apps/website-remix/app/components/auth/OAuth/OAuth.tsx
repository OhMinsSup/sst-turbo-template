import React from "react";

import { Button } from "@template/ui/components/button";

import { Icons } from "~/components/icons";

const sharedClasses =
  "flex h-16 w-full transform cursor-pointer select-none items-center justify-center rounded-xl border-muted-foreground bg-transparent px-3 py-5 transition-transform hover:bg-transparent active:scale-95" as const;

const AuthType = [
  {
    name: "Google",
    text: "구글로 계속하기",
    airaLabel: "Continue with Google",
    className: sharedClasses,
    icon: Icons.googleColor,
  },
];

export default function OAuth() {
  return (
    <>
      {AuthType.map((auth) => (
        <Button
          key={auth.name}
          aria-label={auth.airaLabel}
          variant="outline"
          className={auth.className}
        >
          <auth.icon className="mr-2 h-4 w-4" aria-hidden="true" />
          {auth.text}
        </Button>
      ))}
    </>
  );
}
