import { useFetcher, useSearchParams } from "@remix-run/react";

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

import type { RoutesLoaderData } from "~/.server/routes/dashboard/dashboard.loader";
import { Icons } from "~/components/icons";

export function SidebarWorkspaceSortingDropdown() {
  const fetcher = useFetcher<RoutesLoaderData>();

  const [, setSearchParams] = useSearchParams();

  const onClickDisplayCountItem = (count: number) => {
    setSearchParams((prev) => {
      prev.set("limit", count.toString());
      return prev;
    });
  };

  const onClickOrderItems = (sort: string) => {
    setSearchParams((prev) => {
      prev.set("orderBy", sort);
      return prev;
    });
  };

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
              <DropdownMenuItem onClick={() => onClickOrderItems("createdAt")}>
                수동
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClickOrderItems("updatedAt")}>
                최종 수정 일시
              </DropdownMenuItem>
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
              <DropdownMenuItem onClick={() => onClickDisplayCountItem(5)}>
                항목 5개
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClickDisplayCountItem(10)}>
                항목 10개
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClickDisplayCountItem(15)}>
                항목 15개
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClickDisplayCountItem(20)}>
                항목 20개
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClickDisplayCountItem(0)}>
                모두
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
