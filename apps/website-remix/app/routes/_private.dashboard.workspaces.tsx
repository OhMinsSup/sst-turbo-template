import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import React from "react";
import {
  Await,
  isRouteErrorResponse,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

import { SidebarInset } from "@template/ui/components/sidebar";

import type { RoutesLoaderData } from "~/.server/routes/workspaces/dashboard-workspaces.loader";
import { DashboardHeader } from "~/components/shared/DashboardHeader";
import { Sidebar } from "~/components/shared/Sidebar";
import { SidebarItemEmptyMessage } from "~/components/shared/SidebarItemEmptyMessage";
import { SidebarSkeleton } from "~/components/shared/SidebarSkeleton";
import { WorkspaceSidebarProvider } from "~/components/workspaces/context/sidebar";
import { Layout } from "~/components/workspaces/Layout";
import { SidebarMenu } from "~/components/workspaces/SidebarMenu";
import { SidebarWorkspaces } from "~/components/workspaces/SidebarWorkspaces";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export { loader } from "~/.server/routes/workspaces/dashboard-workspaces.loader";
export { action } from "~/.server/routes/workspaces/dashboard-workspaces.action";

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const serverData = serverLoader<RoutesLoaderData>();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return serverData;
}

clientLoader.hydrate = true;

export default function Routes() {
  const data = useLoaderData<typeof clientLoader>();
  console.log(data);
  return (
    <WorkspaceSidebarProvider>
      <Sidebar to={PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ROOT}>
        <SidebarMenu>
          <ReactErrorBoundary
            fallback={
              <SidebarItemEmptyMessage emptyMessage="에러가 발생했습니다." />
            }
          >
            <React.Suspense fallback={<SidebarSkeleton />}>
              <Await resolve={data}>
                <SidebarWorkspaces />
              </Await>
            </React.Suspense>
          </ReactErrorBoundary>
        </SidebarMenu>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <Layout>
          <Outlet />
        </Layout>
      </SidebarInset>
    </WorkspaceSidebarProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  if (isRouteErrorResponse(error)) {
    return (
      <SidebarItemEmptyMessage emptyMessage="페이지를 찾을 수 없습니다." />
    );
  }

  return null;
}
