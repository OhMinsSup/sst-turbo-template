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
  title: "",
  keywords: [],
  description: "",
  ogImage: "/og/seo.png",
  favicon: "/favicon.ico",
  apple57x57: "/icons/icon_57x57.png",
  apple180x180: "/icons/icon_180x180.png",
  apple256x256: "/icons/icon_256x256.png",
  manifest: "/manifest.webmanifest",
};
