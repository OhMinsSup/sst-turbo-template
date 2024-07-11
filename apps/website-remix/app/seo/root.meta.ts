import type { MetaFunction } from "@remix-run/node";

import type { RoutesLoaderData } from "~/.server/routes/root/root.loader";
import { SITE_CONFIG } from "~/constants/constants";
import { getMeta } from "~/utils/meta";

export const meta: MetaFunction<RoutesLoaderData> = ({ data }) => {
  if (!data) {
    return [{ title: "404 Not Found | Remix" }];
  }

  return getMeta({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteUrl: data.requestInfo.domainUrl,
    image: SITE_CONFIG.ogImage,
  });
};
