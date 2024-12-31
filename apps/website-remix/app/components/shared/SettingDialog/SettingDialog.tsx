import React from "react";
import { Link } from "@remix-run/react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@template/ui/components/dialog";
import { SidebarMenuButton, useSidebar } from "@template/ui/components/sidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@template/ui/components/tabs";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { useBreadcrumb } from "~/providers/breadcrumb.provider";
import { TabAccountForm } from "./components/TabAccountForm";
import { TabIntegrations } from "./components/TabIntegrations";
import { TabNotifications } from "./components/TabNotifications";
import { TabSettingForm } from "./components/TabSettingForm";

export default function SettingDialog() {
  const { isMobile } = useSidebar();
  const item = useBreadcrumb();

  if (item?.type === "SETTING") {
    return null;
  }

  if (isMobile) {
    return (
      <SidebarMenuButton tooltip="설정" asChild>
        <Link to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.SETTING} viewTransition>
          <Icons.Settings />
          <span>설정</span>
        </Link>
      </SidebarMenuButton>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton tooltip="설정">
          <Icons.Settings />
          <span>설정</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent
        className="p-0"
        style={{
          maxWidth: "calc(-100px + 100vw)",
          maxHeight: "715px",
          height: "calc(-100px + 100vh)",
          width: "1150px",
        }}
      >
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>설정</DialogTitle>
            <DialogDescription>사용자 설정 및 계정 관리</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        <Tabs
          defaultValue="account"
          className="flex h-full flex-row overflow-auto"
        >
          <TabsList className="h-full w-[240px] flex-shrink-0 flex-grow-0 overflow-y-auto rounded-r-none">
            <div className="flex size-full flex-col justify-between px-1 pt-3">
              <div className="flex flex-col gap-1 overflow-auto pb-3">
                <h4 className="text-sm text-muted-foreground">계정</h4>
                <TabsTrigger value="account" className="justify-start">
                  <Icons.User className="mr-2 size-4" />
                  <span>내 계정</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="justify-start">
                  <Icons.Settings className="mr-2 size-4" />
                  <span>내 설정</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start">
                  <Icons.Bell className="mr-2 size-4" />
                  <span>내 알림</span>
                </TabsTrigger>
                <TabsTrigger value="integration" className="justify-start">
                  <Icons.LayoutGrid className="mr-2 size-4" />
                  <span>내 연결</span>
                </TabsTrigger>
              </div>
            </div>
          </TabsList>
          <div className="relative h-full flex-grow overflow-hidden">
            <div className="flex size-full flex-col">
              <TabsContent
                tabIndex={-1}
                value="account"
                className="m-0 flex-grow overflow-auto px-16 py-9"
              >
                <TabAccountForm />
              </TabsContent>
              <TabsContent
                tabIndex={-1}
                value="system"
                className="m-0 flex-grow overflow-auto px-16 py-9"
              >
                <TabSettingForm />
              </TabsContent>
              <TabsContent
                tabIndex={-1}
                value="notifications"
                className="m-0 flex-grow overflow-auto px-16 py-9"
              >
                <TabNotifications />
              </TabsContent>
              <TabsContent
                tabIndex={-1}
                value="integration"
                className="m-0 flex-grow overflow-auto px-16 py-9"
              >
                <TabIntegrations />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
