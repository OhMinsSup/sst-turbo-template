import type { MetaFunction } from "@remix-run/node";

import type { RoutesLoaderData } from "~/.server/loaders/_private._dashboard.dashboard.trash.loader";
import { TrashCardList } from "~/components/trash/TrashCardList";
import { TrashToolbar } from "~/components/trash/TrashToolbar";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export { loader } from "~/.server/loaders/_private._dashboard.dashboard.trash.loader";
export { action } from "~/.server/actions/_private._dashboard.dashboard.trash.action";

export const meta: MetaFunction<RoutesLoaderData> = () => {
  return getMeta({
    title: `워크스페이스 휴지통 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return (
    <>
      <TrashToolbar />
      <TrashCardList />
    </>
  );
}
