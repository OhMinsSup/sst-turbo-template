import type { MetaFunction } from "@remix-run/node";

import type { RoutesLoaderData } from "~/.server/routes/root/loaders/root.loader";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/libs/meta";

export const meta: MetaFunction<RoutesLoaderData> = ({ data }) => {
  if (!data) {
    return [{ title: `404 Not Found | ${SITE_CONFIG.title}` }];
  }

  return getMeta({
    title: `워크스페이스 | ${SITE_CONFIG.title}`,
  });
};
