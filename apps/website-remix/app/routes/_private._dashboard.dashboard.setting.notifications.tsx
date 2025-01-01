import type { MetaFunction } from "@remix-run/node";

import { TabNotifications } from "~/components/shared/SettingDialog/components/TabNotifications";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export const meta: MetaFunction = () => {
  return getMeta({
    title: `내 알림 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return <TabNotifications />;
}
