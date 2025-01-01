import type { MetaFunction } from "@remix-run/node";

import { DashboardToolbar } from "~/components/dashboard/DashboardToolbar";
import { WorkspaceCardList } from "~/components/dashboard/WorkspaceCardList";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export { loader } from "~/.server/loaders/_private._dashboard.dashboard._index.loader";
export { action } from "~/.server/actions/_private._dashboard.dashboard._index.action";

export const meta: MetaFunction = () => {
  return getMeta({
    title: `대시보드 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return (
    <>
      <DashboardToolbar />
      <WorkspaceCardList />
    </>
  );
}
