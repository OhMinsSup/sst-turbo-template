import React from "react";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";

import { Icons } from "~/components/icons";

interface TrashItemProps {
  item: components["schemas"]["WorkspaceEntity"];
}

export function TrashItem({ item }: TrashItemProps) {
  return (
    <div
      className="mx-1 cursor-pointer rounded-sm transition hover:bg-primary-foreground"
      style={{
        width: "calc(100% - 8px)",
      }}
    >
      <div className="flex min-h-12 w-full items-center py-1">
        <div className="ml-[10px] mr-1 mt-[1px] flex items-center justify-center self-center">
          <Icons.Database size={20} />
        </div>
        <div className="mx-[6px] min-w-0 flex-auto">
          <div className="truncate">{item.title}</div>
        </div>
        <div className="ml-0 mr-3 min-w-0 flex-shrink-0 flex-grow-0 basis-auto">
          <div className="flex gap-1">
            <Button size="icon" variant="ghost">
              <Icons.Undo2 />
            </Button>
            <Button size="icon" variant="ghost">
              <Icons.Trash />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
