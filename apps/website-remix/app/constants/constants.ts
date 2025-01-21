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
      FAVORITES: "/dashboard/favorites",
      RESET_PASSWORD: "/dashboard/reset-password",
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
  keywords: ["Database", "Authentication", "File Storage", "Admin Dashboard"],
  description:
    "실시간 데이터베이스, 인증, 파일 저장 및 관리자 대시보드가 포함된 오픈 소스 백엔드",
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
