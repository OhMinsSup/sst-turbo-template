import { useState } from "react";

import { Button } from "@template/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@template/ui/components/dropdown-menu";

import { Icons } from "~/components/icons";

export interface SidebarSortingDropdownProps {
  limit: number;
  sortTag: string;
  onChangeLimitCount: (count: number) => void;
  onChangeSortTag: (sort: string) => void;
}

export default function SidebarSortingDropdown({
  onChangeSortTag,
  onChangeLimitCount,
  limit,
  sortTag,
}: SidebarSortingDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <Icons.MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2 p-2">
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <Icons.ArrowDownUp className="size-4 shrink-0" />
            </div>
            정렬
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {[
                { id: "createdAt", name: "생성일시" },
                { id: "updatedAt", name: "수정 일시" },
              ].map((item) => (
                <DropdownMenuItem
                  key={`sidebar:sort-${item.id}`}
                  className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  onClick={() => onChangeSortTag(item.id)}
                  data-selected={sortTag === item.id}
                  aria-selected={sortTag === item.id}
                >
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2 p-2">
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <Icons.Hash className="size-4 shrink-0" />
            </div>
            표시
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {[5, 10, 15, 20, 0].map((item) => (
                <DropdownMenuItem
                  key={`sidebar:display-${item}`}
                  onClick={() => onChangeLimitCount(item)}
                  className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  aria-selected={limit === item}
                  data-selected={limit === item}
                >
                  {item === 0 ? "모두" : `항목 ${item}개`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
