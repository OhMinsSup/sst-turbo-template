export const API_ENDPOINTS = {
  avatar: (searchParams: URLSearchParams, styles = "notionists") => {
    const url = new URL(`/7.x/${styles}/jpg`, "https://api.dicebear.com");
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.append(key, value);
    }
    return url.href;
  },
};

export const ASSET_URL = {};

export const PAGE_ENDPOINTS = {
  ROOT: "/",
  AUTH: {
    SIGNIN: "/signin",
    SIGNUP: "/signup",
  },
} as const;

export const SITE_CONFIG = {
  title: "Next.js by Vercel - The React Framework",
  keywords: ["Next.js", "React", "Framework"],
  description:
    "Next.js by Vercel is the full-stack React framework for the web.",
  ogImage: "/opengraph-image.png",
  favicon: "/favicon.ico",
  apple32x32: "/images/favicon-32.png",
  apple180x180: "/images/favicon-180.png",
  apple192x192: "/images/favicon-192.png",
  manifest: "/manifest.webmanifest",
};
