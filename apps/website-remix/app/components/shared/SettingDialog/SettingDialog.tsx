import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@template/ui/components/dialog";
import { SidebarMenuButton } from "@template/ui/components/sidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@template/ui/components/tabs";

import { Icons } from "~/components/icons";
import TabAccountForm from "./components/TabAccountForm";

export default function SettingDialog() {
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
        <Tabs
          defaultValue="profile"
          className="flex h-full flex-row overflow-auto"
        >
          <TabsList className="h-full w-[240px] flex-shrink-0 flex-grow-0 overflow-y-auto rounded-r-none">
            <div className="flex size-full flex-col justify-between px-1 pt-3">
              <div className="flex flex-col gap-1 overflow-auto pb-3">
                <h4 className="text-sm text-muted-foreground">계정</h4>
                <TabsTrigger value="profile" className="justify-start">
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
                value="profile"
                className="m-0 flex-grow overflow-auto px-16 py-9"
              >
                <TabAccountForm />
              </TabsContent>
              <TabsContent
                tabIndex={-1}
                value="system"
                className="m-0 flex-grow overflow-auto px-16 py-9"
              >
                {Array.from({ length: 100 }).map((_, index) => (
                  <div className="size-[200px]">프로필</div>
                ))}
              </TabsContent>
              <TabsContent
                tabIndex={-1}
                value="notifications"
                className="m-0 flex-grow overflow-auto px-16 py-9"
              >
                {Array.from({ length: 100 }).map((_, index) => (
                  <div className="size-[200px]">프로필</div>
                ))}
              </TabsContent>
              <TabsContent
                tabIndex={-1}
                value="integration"
                className="m-0 flex-grow overflow-auto px-16 py-9"
              >
                {Array.from({ length: 100 }).map((_, index) => (
                  <div className="size-[200px]">프로필</div>
                ))}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
