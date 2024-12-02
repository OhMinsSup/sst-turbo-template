import { useTransition } from "react";
import { useFetcher } from "@remix-run/react";

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

import type { WorkspaceType } from "./SidebarWorkspaceMneuItems";
import type { RoutesLoaderData } from "~/.server/routes/dashboard/dashboard.loader";
import { Icons } from "~/components/icons";
import { useDashboardSidebarProvider } from "./context";

interface SidebarWorkspaceSortingDropdownProps {
  workspaceType: WorkspaceType;
}

export function SidebarWorkspaceSortingDropdown(
  _: SidebarWorkspaceSortingDropdownProps,
) {
  const [, startTransition] = useTransition();
  const fetcher = useFetcher<RoutesLoaderData>({
    key: "dashboard:sidebar:workspaces",
  });
  const { changeLimit, changeSortTag, query } = useDashboardSidebarProvider();

  const onClickDisplayCountItem = (count: number) => {
    changeLimit({
      value: count,
    });

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) searchParams.append(key, value);
    }
    searchParams.set("limit", count.toString());

    startTransition(() => {
      fetcher.load(`/dashboard?${searchParams.toString()}`);
    });
  };

  const onClickOrderItems = (sort: string) => {
    changeSortTag({
      value: sort as "createdAt" | "updatedAt" | "order" | undefined,
    });

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) searchParams.append(key, value);
    }
    searchParams.set("sortTag", sort);

    startTransition(() => {
      fetcher.load(`/dashboard?${searchParams.toString()}`);
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
              {[
                { id: "createdAt", name: "생성일시" },
                { id: "updatedAt", name: "수정 일시" },
              ].map((item) => (
                <DropdownMenuItem
                  key={`sort-${item.id}`}
                  className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  onClick={() => onClickOrderItems(item.id)}
                  data-selected={query.sortTag === item.id}
                  aria-selected={query.sortTag === item.id}
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
                  key={`display-${item}`}
                  onClick={() => onClickDisplayCountItem(item)}
                  className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  aria-selected={query.limit === item}
                  data-selected={query.limit === item}
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
