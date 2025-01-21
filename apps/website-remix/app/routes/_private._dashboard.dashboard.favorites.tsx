import type { MetaFunction } from "@remix-run/node";

import { ClientOnly } from "@template/ui/common-components/client-only";

import { DashboardCardList } from "~/components/dashboard/DashboardCardList";
import { DashboardToolbar } from "~/components/dashboard/DashboardToolbar";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export { loader } from "~/.server/loaders/_private._dashboard.dashboard.favorites.loader";
export { action } from "~/.server/actions/_private._dashboard.dashboard._index.action";

export const meta: MetaFunction = () => {
  return getMeta({
    title: `즐겨찾기 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return (
    <>
      <DashboardToolbar />
      <ClientOnly fallback={<DashboardCardList.Loading />}>
        <DashboardCardList favorite />
      </ClientOnly>
    </>
  );
}
