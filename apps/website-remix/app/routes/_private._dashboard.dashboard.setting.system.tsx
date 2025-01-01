import type { MetaFunction } from "@remix-run/node";

import { TabSettingForm } from "~/components/shared/SettingDialog/components/TabSettingForm";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export const meta: MetaFunction = () => {
  return getMeta({
    title: `내 설정 | ${SITE_CONFIG.title}`,
  });
};

export default function Routes() {
  return <TabSettingForm />;
}
