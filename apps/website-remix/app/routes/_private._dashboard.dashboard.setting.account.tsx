import type { MetaFunction } from "@remix-run/node";

import { TabAccountForm } from "~/components/shared/SettingDialog/components/TabAccountForm";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export { action } from "~/.server/actions/_private._dashboard.dashboard.setting.account.action";

export const meta: MetaFunction = () => {
  return getMeta({
    title: `내 계정 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return <TabAccountForm />;
}
