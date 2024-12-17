import React from "react";

import { ScrollArea } from "@template/ui/components/scroll-area";

import { useBreadcrumb } from "~/hooks/useBreadcrumbs";
import { TrashItem } from "./TrashItem";

export function TrashPopoverScrollArea() {
  const item = useBreadcrumb();
  console.log(item);

  return (
    <ScrollArea>
      {Array.from({ length: 200 }).map((_, index) => (
        <TrashItem key={index} />
      ))}
    </ScrollArea>
  );
}
