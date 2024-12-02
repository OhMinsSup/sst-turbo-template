import type { LinkProps } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@template/ui/components/sidebar";

import type { RoutesActionData } from "~/.server/routes/dashboard/dashboard.action";
import type { RoutesLoaderData } from "~/.server/routes/dashboard/dashboard.loader";
import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export enum WorkspaceType {
  Favorite = "favorite",
  Default = "default",
}

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

interface SidebarWorkspaceMneuItemsProps {
  workspaceType: WorkspaceType;
  initialData?: components["schemas"]["WorkspaceEntity"][];
}

export function SidebarWorkspaceMneuItems({
  initialData,
}: SidebarWorkspaceMneuItemsProps) {
  const fetcher = useFetcher<RoutesLoaderData & RoutesActionData>({
    key: "dashboard:sidebar:workspaces",
  });

  const [items, setItems] = useState(generateWorkspaceItems(initialData ?? []));

  const updateItems = (items: components["schemas"]["WorkspaceEntity"][]) => {
    const newItems = generateWorkspaceItems(items);
    setItems((prevItems) => {
      const uniqueItems = newItems.filter(
        (newItem) => !prevItems.some((prevItem) => prevItem.id === newItem.id),
      );
      return [...prevItems, ...uniqueItems];
    });
  };

  const replaceItems = (items: components["schemas"]["WorkspaceEntity"][]) => {
    // items의 id와 같은 아이템을 찾아서 교체 후 반환
    setItems((prevItems) => {
      return prevItems.map((prevItem) => {
        const newItem = items.find((item) => item.id === prevItem.meta.id);
        return newItem ? { ...prevItem, meta: newItem } : prevItem;
      });
    });
  };

  useEffect(() => {
    if (
      fetcher.data &&
      "workspaces" in fetcher.data &&
      Array.isArray(fetcher.data.workspaces)
    ) {
      updateItems(fetcher.data.workspaces);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (
      fetcher.data &&
      "workspace" in fetcher.data &&
      fetcher.formMethod === "PATCH"
    ) {
      replaceItems([fetcher.data.workspace]);
    }
  }, [fetcher.data, fetcher.formMethod]);

  return (
    <>
      {items.map((item) => (
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
  const data = useLoaderData<RoutesLoaderData>();
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
    formData.append("queryHashKey", data.queryHashKey);
    fetcher.submit(formData, {
      method: "patch",
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={title} asChild>
        <Link to={to} {...item}>
          {IconComponent && <IconComponent />}
          <span>{title}</span>
          <div className="flex w-full items-center justify-end">
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
