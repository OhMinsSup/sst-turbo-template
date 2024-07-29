import type { MetadataRoute } from "next";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js by Vercel - The React Framework",
    short_name: "Next.js",
    description:
      "Next.js by Vercel is the full-stack React framework for the web.",
    start_url: PAGE_ENDPOINTS.ROOT,
    icons: [
      {
        src: "/images/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    background_color: "#ffffff",
    theme_color: "#ffffff",
    display: "standalone",
  };
}
