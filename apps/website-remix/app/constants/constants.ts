export const ASSET_URL = {};

export const PAGE_ENDPOINTS = {
  ROOT: "/",
  AUTH: {
    SIGNIN: "/signin",
    SIGNUP: "/signup",
  },
} as const;

export const SITE_CONFIG = {
  title: "Remix - Build Better Websites",
  keywords: ["Remix", "React", "Framework"],
  description:
    "Remix is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience. People are gonna love using your stuff.",
  ogImage: "/images/og.jpg",
  favicon: "/favicon.ico",
  apple32x32: "/images/favicon-32.png",
  apple180x180: "/images/favicon-180.png",
  apple192x192: "/images/favicon-192.png",
  manifest: "/site.webmanifest",
};

export const CONSTANT_KEY = {
  ACCESS_TOKEN: "template.access_token",
  REFRESH_TOKEN: "template.refresh_token",
};
