import React from "react";

import { Separator } from "@template/ui/components/separator";

interface TitleProps {
  children: React.ReactNode;
}

export function Title({ children }: TitleProps) {
  return (
    <div className="mb-4 space-y-3">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h4>
      <Separator />
    </div>
  );
}
