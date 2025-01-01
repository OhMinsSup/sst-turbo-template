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
      RESET_PASSWORD: "/dashboard/reset-password",
      // DEPRECATED
      TRASH: "/dashboard/trash",
      SETTING: "/dashboard/setting/account",
      NOTIFICATIONS: "/dashboard/setting/notifications",
      INTEGRATION: "/dashboard/setting/integration",
      SYSTEM: "/dashboard/setting/system",
    },
    PREFERENCES: {
      ME: "/dashboard/account/me",
    },
    WORKSPACE: {
      ROOT: "/dashboard/workspaces",
      ID: (workspaceId: string | number) =>
        `/dashboard/workspaces/${workspaceId}`,
      EDITOR: {
        ROOT: (workspaceId: string | number) =>
          `/dashboard/workspaces/${workspaceId}/editor`,
        TABLE_ID: (workspaceId: string | number, tableId: string | number) =>
          `/dashboard/workspaces/${workspaceId}/editor/${tableId}`,
      },
      SETTINGS: {
        GENERAL: (workspaceId: string | number) =>
          `/dashboard/workspaces/${workspaceId}/settings/general`,
      },
    },
  },
} as const;

export const SITE_CONFIG = {
  title: "TemplateBase",
  shotTitle: "TemplateBase",
  keywords: ["Remix", "Database", "Data", "Analysts", "Developers"],
  description:
    "TemplateBase is a No-code database platform for building web applications.",
  ogImage: "/images/og.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  creator: "@Lalossol",
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
