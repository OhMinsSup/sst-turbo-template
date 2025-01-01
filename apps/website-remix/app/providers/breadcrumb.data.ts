import type { BaseBreadcrumbItem } from "./breadcrumb.utils";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export const breadcrumb = new Map<RegExp, BaseBreadcrumbItem[]>([
  [
    /^\/dashboard\/?$/,
    [
      {
        title: "대시보드",
        isLast: true,
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
        pathnameRegex: /^\/dashboard\/?$/,
        type: "DASHBOARD",
      },
    ],
  ],
  [
    /^\/dashboard\/account\/(me|tokens|security|audit)\/?$/,
    [
      {
        title: "대시보드",
        isLast: false,
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
        pathnameRegex: /^\/dashboard\/?$/,
        type: "DASHBOARD",
        children: [
          {
            title: "계정",
            isLast: false,
            pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.SETTING,
            pathnameRegex: /^\/dashboard\/setting\/?$/,
            type: "PREFERENCES",
            children: [
              {
                title: "환경설정",
                isLast: true,
                pathname: PAGE_ENDPOINTS.PROTECTED.PREFERENCES.ME,
                pathnameRegex: /^\/dashboard\/account\/me\/?$/,
                type: "ACCOUNT",
              },
            ],
          },
        ],
      },
    ],
  ],
  [
    /^\/dashboard\/workspaces\/[a-zA-Z0-9]+\/(editor)\/?$/,
    [
      {
        title: "대시보드",
        isLast: false,
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
        pathnameRegex: /^\/dashboard\/?$/,
        type: "DASHBOARD",
        children: [
          {
            title: "워크스페이스",
            isLast: false,
            pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
            pathnameRegex: /^\/dashboard\/workspaces\/[a-zA-Z0-9]+\/?$/,
            type: "WORKSPACE",
            children: [
              {
                title: "홈",
                isLast: true,
                pathname: (params) => {
                  if (params?.workspaceId) {
                    return PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ID(
                      params.workspaceId,
                    );
                  }
                  throw new Error("workspaceId is required");
                },
                pathnameRegex: /^\/dashboard\/workspaces\/[a-zA-Z0-9]+\/?$/,
                type: "HOME",
              },
              {
                title: "테이블",
                isLast: true,
                pathname: (params) => {
                  if (params?.workspaceId) {
                    return PAGE_ENDPOINTS.PROTECTED.WORKSPACE.EDITOR.ROOT(
                      params.workspaceId,
                    );
                  }
                  throw new Error("workspaceId is required");
                },
                pathnameRegex:
                  /^\/dashboard\/workspaces\/[a-zA-Z0-9]+\/editor\/?$/,
                type: "TABLE",
              },
            ],
          },
        ],
      },
    ],
  ],
]);
