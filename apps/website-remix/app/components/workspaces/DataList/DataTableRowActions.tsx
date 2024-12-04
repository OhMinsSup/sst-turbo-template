"use client";

import type { Row } from "@tanstack/react-table";
import { useFetcher, useNavigation } from "@remix-run/react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@template/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@template/ui/components/dropdown-menu";

import type { RoutesActionData } from "~/.server/routes/workspaces/actions/dashboard-workspaces_index.action";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigation = useNavigation();
  const fetcher = useFetcher<RoutesActionData>({
    key: "dashboard:sidebar:workspaces",
  });

  const onClickFavorite = () => {
    const workspaceId = row.getValue<number>("id");
    const nextFavorite = !(row.getValue<string>("isFavorite") === "true");
    const formData = new FormData();
    formData.append("workspaceId", workspaceId.toString());
    formData.append("isFavorite", nextFavorite.toString());
    fetcher.submit(formData, {
      method: "PATCH",
    });
  };

  const onClickDelete = () => {
    const workspaceId = row.getValue<number>("id");
    const formData = new FormData();
    formData.append("workspaceId", workspaceId.toString());
    fetcher.submit(formData, {
      method: "DELETE",
    });
  };

  const isSubmittingForm = navigation.state === "submitting";

  const isFavorite = row.getValue("isFavorite") === "true";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          disabled={isSubmittingForm}
          aria-disabled={isSubmittingForm}
        >
          수정
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isSubmittingForm}
          aria-disabled={isSubmittingForm}
          onClick={onClickFavorite}
        >
          {isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSubmittingForm}
          aria-disabled={isSubmittingForm}
          onClick={onClickDelete}
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
