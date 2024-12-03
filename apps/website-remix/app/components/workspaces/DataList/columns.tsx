import type { ColumnDef } from "@tanstack/react-table";

import type { components } from "@template/api-types";
import { Checkbox } from "@template/ui/components/checkbox";
import { format, toDate } from "@template/utils/date";

import { Icons } from "~/components/icons";
import { DataTableColumnHeader } from "~/components/workspaces/DataList/DataTableColumnHeader";
import { DataTableRowActions } from "~/components/workspaces/DataList/DataTableRowActions";

export type CustomWorkspaceEntity = components["schemas"]["WorkspaceEntity"] & {
  isFavorite: "true" | "false";
};

export const getCustomWorkspaceEntity = (
  entity: components["schemas"]["WorkspaceEntity"][],
): CustomWorkspaceEntity => {
  return entity.map((item) => ({
    ...item,
    isFavorite: item.isFavorite ? "true" : "false",
  })) as CustomWorkspaceEntity;
};

export const getTitle: Record<string, string> = {
  ["title"]: "이름",
  ["description"]: "설명",
  ["isFavorite"]: "즐겨찾기",
  ["createdAt"]: "생성일",
  ["updatedAt"]: "수정일",
  ["actions"]: "작업",
};

export const columns: ColumnDef<CustomWorkspaceEntity>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="아이디" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="이름" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="설명" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isFavorite",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="즐겨찾기" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          {row.getValue("isFavorite") === "true" ? (
            <Icons.Star className="fill-current text-yellow-300" />
          ) : (
            <Icons.Star className="text-yellow-300" />
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="생성일" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        {format(toDate(row.getValue("createdAt")), "yyyy/MM/dd HH:mm:ss")}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="수정일" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        {format(toDate(row.getValue("updatedAt")), "yyyy/MM/dd HH:mm:ss")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
