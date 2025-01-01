import type { MetaDescriptor } from "@remix-run/node";

import { SITE_CONFIG } from "~/constants/constants";

type CustomMetaArgs = {
  title: string;
  description?: string;
  siteUrl?: string;
  image?: string;
} & { additionalMeta?: MetaDescriptor[] };

export const getMeta = ({
  title,
  description,
  siteUrl,
  image,
  additionalMeta,
}: CustomMetaArgs) => {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:url", content: siteUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:type", content: SITE_CONFIG.ogType },
    { name: "twitter:card", content: SITE_CONFIG.twitterCard },
    { name: "twitter:creator", content: SITE_CONFIG.creator },
    { name: "twitter:site", content: SITE_CONFIG.creator },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    ...(additionalMeta ?? []),
  ].filter((v) => {
    if ("content" in v) {
      return !!v.content;
    }
    return true;
  });
};
