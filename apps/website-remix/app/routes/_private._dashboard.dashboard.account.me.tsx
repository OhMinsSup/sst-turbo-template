import type { MetaFunction } from "@remix-run/node";

import { PreferencesForm } from "~/components/dashboard/PreferencesForm";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export { action } from "~/.server/actions/_private._dashboard.dashboard.account.me.action";

export const meta: MetaFunction = () => {
  return getMeta({
    title: `횐경설정 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return <PreferencesForm />;
}
