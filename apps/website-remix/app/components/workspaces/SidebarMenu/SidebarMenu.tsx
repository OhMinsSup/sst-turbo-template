import React, { useTransition } from "react";
import { useFetcher } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/workspaces/dashboard-workspaces.loader";
import { SidebarAddItemDialog } from "~/components/shared/SidebarAddItemDialog";
import { SidebarMenuNav } from "~/components/shared/SidebarMenuNav";
import { useWorkspaceSidebarProvider } from "~/components/workspaces/context/sidebar";
import { SidebarForm } from "~/components/workspaces/SidebarForm";

interface SidebarMenuProps {
  children: React.ReactNode;
}

export default function SidebarMenu({ children }: SidebarMenuProps) {
  const [, startTransition] = useTransition();
  const { query, changeLimit, changeSortTag } = useWorkspaceSidebarProvider();
  const fetcher = useFetcher<RoutesLoaderData>({
    key: "dashboard:sidebar:workspaces",
  });

  const onChangeLimitCount = (count: number) => {
    changeLimit({
      value: count,
    });

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) searchParams.append(key, value);
    }
    searchParams.set("limit", count.toString());

    startTransition(() => {
      fetcher.load(`/dashboard/workspaces?${searchParams.toString()}`);
    });
  };

  const onChangeSortTag = (sort: string) => {
    changeSortTag({
      value: sort as "createdAt" | "updatedAt" | "order",
    });

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) searchParams.append(key, value);
    }
    searchParams.set("sortTag", sort);

    startTransition(() => {
      fetcher.load(`/dashboard/workspaces?${searchParams.toString()}`);
    });
  };

  return (
    <SidebarMenuNav
      title="워크스페이스"
      addFormComponent={
        <SidebarAddItemDialog
          title="워크스페이스"
          description="새로운 워크스페이스를 만들어주세요."
          formId="create-workspace-form"
        >
          {(props) => <SidebarForm {...props} />}
        </SidebarAddItemDialog>
      }
      onChangeLimitCount={onChangeLimitCount}
      onChangeSortTag={onChangeSortTag}
      {...query}
    >
      {children}
    </SidebarMenuNav>
  );
}
