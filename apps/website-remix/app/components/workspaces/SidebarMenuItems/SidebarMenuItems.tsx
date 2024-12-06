import type { LinkProps } from "@remix-run/react";
import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useFetcher, useNavigation } from "@remix-run/react";
import { take } from "lodash-es";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@template/ui/components/sidebar";

import type { RoutesActionData } from "~/.server/routes/workspaces/actions/dashboard-workspaces.action";
import type { RoutesLoaderData } from "~/.server/routes/workspaces/loaders/dashboard-workspaces.loader";
import { Icons } from "~/components/icons";
import { SidebarItemEmptyMessage } from "~/components/shared/SidebarItemEmptyMessage";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { useWorkspaceSidebarProvider } from "../context/sidebar";

export interface WorkspaceMenuItem extends LinkProps {
  discover?: "render" | "none";
  prefetch?: "intent" | "render" | "none" | "viewport";
  meta: components["schemas"]["WorkspaceEntity"];
  title: string;
  icon?: React.ElementType;
}

function generateWorkspaceItems(
  workspaces: components["schemas"]["WorkspaceEntity"][],
): WorkspaceMenuItem[] {
  return workspaces.map((workspace) => ({
    meta: workspace,
    title: workspace.title,
    to: PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ID(workspace.id),
    icon: Icons.Command,
    viewTransition: true,
  }));
}

interface SidebarMenuItemsProps {
  initialData?: components["schemas"]["WorkspaceEntity"][];
}

export default function SidebarMenuItems({
  initialData,
}: SidebarMenuItemsProps) {
  const { state } = useSidebar();
  const fetcher = useFetcher<RoutesLoaderData & RoutesActionData>({
    key: "dashboard:sidebar:workspaces",
  });

  const { query } = useWorkspaceSidebarProvider();

  const [items, setItems] = useState(generateWorkspaceItems(initialData ?? []));

  const limitedItems = useMemo(
    () => take(items, query.limit),
    [items, query.limit],
  );

  const updateItems = useCallback(
    (workspaces: components["schemas"]["WorkspaceEntity"][]) => {
      const newItems = generateWorkspaceItems(workspaces);
      const oldItems = items;
      const compare =
        newItems.length > oldItems.length
          ? {
              length: newItems.length,
              type: "new",
            }
          : {
              length: oldItems.length,
              type: "old",
            };

      if (compare.type === "new") {
        const uniqueItems = newItems.filter(
          (newItem) =>
            !oldItems.some((oldItem) => oldItem.meta.id === newItem.meta.id),
        );
        setItems([...oldItems, ...uniqueItems]);
      } else {
        const uniqueItems = oldItems.filter(
          (oldItem) =>
            !newItems.some((newItem) => newItem.meta.id === oldItem.meta.id),
        );
        setItems([...newItems, ...uniqueItems]);
      }
    },
    [items],
  );

  const replaceItems = (newItem: components["schemas"]["WorkspaceEntity"]) => {
    const newItems = generateWorkspaceItems([newItem]);

    // items의 id와 같은 아이템을 찾아서 교체 후 반환
    setItems((prevItems) => {
      return prevItems.map((prevItem) => {
        const newItem = newItems.find(
          (item) => item.meta.id === prevItem.meta.id,
        );
        return newItem ? newItem : prevItem;
      });
    });
  };

  // 정렬, 필터링, 페이징에 대한 업데이트
  useEffect(() => {
    if (
      fetcher.data &&
      "workspaces" in fetcher.data &&
      Array.isArray(fetcher.data.workspaces)
    ) {
      const newItems = fetcher.data.workspaces;
      startTransition(() => {
        updateItems(newItems);
      });
    }
  }, [fetcher.data, updateItems]);

  // 즐겨찾기 상태에 대한 업데이트
  useEffect(() => {
    if (
      fetcher.formMethod === "PATCH" &&
      fetcher.data &&
      "workspace" in fetcher.data
    ) {
      const newItem = fetcher.data.workspace;
      startTransition(() => {
        if (newItem) {
          replaceItems(newItem);
        }
      });
    }
  }, [fetcher.data, fetcher.formMethod]);

  if (!items.length && state === "expanded") {
    return <SidebarItemEmptyMessage emptyMessage="워크스페이스가 없습니다." />;
  }

  return (
    <>
      {limitedItems.map((item) => (
        <SidebarWorkspaceMenuItem
          key={`@@workspace::${item.meta.id}`}
          {...item}
        />
      ))}
    </>
  );
}

type SidebarWorkspaceMenuItemProps = WorkspaceMenuItem & {};

function SidebarWorkspaceMenuItem({
  to,
  title,
  icon: IconComponent,
  meta,
  ...item
}: SidebarWorkspaceMenuItemProps) {
  const navigation = useNavigation();
  const fetcher = useFetcher<RoutesLoaderData>({
    key: "dashboard:sidebar:workspaces",
  });
  const nextFavorite = (!meta.isFavorite).toString();

  const isSubmittingForm = navigation.state === "submitting";

  const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("workspaceId", meta.id.toString());
    formData.append("isFavorite", nextFavorite);
    fetcher.submit(formData, {
      method: "patch",
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={title} asChild>
        <Link to={to} {...item}>
          {IconComponent && <IconComponent />}
          <span className="w-full">{title}</span>
          <div className="flex items-center justify-end">
            <Button
              type="button"
              className="float-right"
              size="icon"
              variant="ghost"
              disabled={isSubmittingForm}
              aria-disabled={isSubmittingForm}
              onClick={onClickSubmit}
            >
              {meta.isFavorite ? (
                <Icons.Star className="fill-current text-yellow-300" />
              ) : (
                <Icons.Star className="text-yellow-300" />
              )}
            </Button>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
