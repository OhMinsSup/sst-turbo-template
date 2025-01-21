import type { BreadcrumbItem } from "./breadcrumb.types";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "대시보드",
    pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT,
    type: "DASHBOARD",
    children: [
      {
        title: "즐겨찾기",
        type: "FAVORITE",
        pathname: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.FAVORITES,
      },
      {
        title: "계정",
        type: "PREFERENCES",
        children: [
          {
            title: "환경설정",
            pathname: PAGE_ENDPOINTS.PROTECTED.PREFERENCES.ME,
            type: "ACCOUNT",
          },
        ],
      },
      {
        title: "워크스페이스",
        type: "WORKSPACE",
        children: [
          {
            title: "홈",
            pathname: (params) => {
              const workspaceId = params?.workspaceId ?? "null";
              return PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ID(workspaceId);
            },
            type: "HOME",
          },
          {
            title: "테이블",
            pathname: (params) => {
              const workspaceId = params?.workspaceId ?? "null";
              return PAGE_ENDPOINTS.PROTECTED.WORKSPACE.EDITOR.ROOT(
                workspaceId,
              );
            },
            type: "TABLE",
          },
        ],
      },
    ],
  },
];
