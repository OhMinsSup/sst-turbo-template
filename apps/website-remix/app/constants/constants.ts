export const ASSET_URL = {};

export const PAGE_ENDPOINTS = {
  ROOT: "/",
  AUTH: {
    SIGNIN: "/signin",
    SIGNUP: "/signup",
  },
  PROTECTED: {
    DASHBOARD: {
      ROOT: "/dashboard",
    },
    WORKSPACE: {
      ROOT: "/dashboard/workspaces",
      ID: (workspaceId: string | number) =>
        `/dashboard/workspaces/${workspaceId}`,
    },
  },
} as const;

export const SITE_CONFIG = {
  title: "RemixBase",
  shotTitle: "RemixBase",
  keywords: ["Remix", "React", "Framework", "Admin", "Template"],
  description: "RemixBase is a Remix Framework Admin Template",
  ogImage: "/images/og.jpg",
  favicon: "/favicon.ico",
  favicon32x32: "/images/favicon-32x32.png",
  favicon16x16: "/images/favicon-16x16.png",
  apple: "/images/apple-touch-icon.png",
  android192x192: "/images/android-chrome-192x192.png",
  android512x512: "/images/android-chrome-512x512.png",
  manifest: "/site.webmanifest",
  404: "/images/404.png",
  500: "/images/500.png",
};

export const SESSION_DATA_KEY = {
  dataKey: "session.data",
  themeKey: "template.theme",
  toastKey: "template.toast",
  timezoneKey: "template.timezone",
  deviceKey: "template.device",
};
