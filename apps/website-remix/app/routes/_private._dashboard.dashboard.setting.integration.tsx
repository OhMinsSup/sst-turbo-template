import type { MetaFunction } from "@remix-run/node";

import { TabIntegrations } from "~/components/shared/SettingDialog/components/TabIntegrations";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export const meta: MetaFunction = () => {
  return getMeta({
    title: `내 설정 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return <TabIntegrations />;
}
