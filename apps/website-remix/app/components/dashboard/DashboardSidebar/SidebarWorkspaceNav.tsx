import { useEffect, useState } from "react";
import {
  Link,
  useActionData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { FormFieldCreateWorkspace } from "@template/validators/workspace";
import { Button } from "@template/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@template/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@template/ui/components/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@template/ui/components/form";
import { Input } from "@template/ui/components/input";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@template/ui/components/sidebar";
import { Textarea } from "@template/ui/components/textarea";
import { createWorkspaceSchema } from "@template/validators/workspace";

import type { WorkspaceMenuItem } from "./DashboardWorkspaceSidebar";
import type { RoutesActionData } from "~/.server/routes/dashboard/dashboard.action";
import { Icons } from "~/components/icons";

interface SidebarWorkspaceNavProps {
  type: "favorite" | "default";
  title: string;
  items: WorkspaceMenuItem[];
  emptyMessage?: React.ReactNode;
}

type SidebarTitleProps = Pick<SidebarWorkspaceNavProps, "title" | "type"> & {};

function ApplyWorkspaceButton() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<RoutesActionData>();

  const isSubmittingForm = navigation.state === "submitting";

  const form = useForm<FormFieldCreateWorkspace>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    errors: actionData && "error" in actionData ? actionData.error : undefined,
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const onSubmit = form.handleSubmit((input) => {
    const formData = new FormData();
    formData.append("title", input.title);
    if (input.description) {
      formData.append("description", input.description);
    }
    submit(input, {
      method: "post",
      replace: true,
    });
  });

  useEffect(() => {
    if (actionData?.success) {
      setOpen(false);
      form.reset();
    }
  }, [actionData?.success]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Icons.Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>워크스페이스 등록</DialogTitle>
          <DialogDescription>
            새로운 워크스페이스를 등록합니다.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-workspace-form"
            className="flex w-full flex-col gap-1.5 py-4 text-start"
            onSubmit={onSubmit}
          >
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="워크스페이스 제목"
                        autoCapitalize="none"
                        dir="auto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="워크스페이스 설명"
                        dir="auto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={isSubmittingForm}
            aria-disabled={isSubmittingForm}
            type="submit"
            form="create-workspace-form"
          >
            {isSubmittingForm ? (
              <Icons.Spinner className="mr-2 size-4 animate-spin" />
            ) : null}
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SortingWorkspaceDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <Icons.MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2 p-2">
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <Icons.ArrowDownUp className="size-4 shrink-0" />
            </div>
            정렬
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>수동</DropdownMenuItem>
              <DropdownMenuItem>최종 수정 일시</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2 p-2">
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <Icons.Hash className="size-4 shrink-0" />
            </div>
            표시
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>항목 5개</DropdownMenuItem>
              <DropdownMenuItem>항목 10개</DropdownMenuItem>
              <DropdownMenuItem>항목 15개</DropdownMenuItem>
              <DropdownMenuItem>항목 20개</DropdownMenuItem>
              <DropdownMenuItem>모두</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarTitle({ title, type }: SidebarTitleProps) {
  return (
    <>
      <span>{title}</span>
      <div className="flex flex-row gap-2">
        <SortingWorkspaceDropdown />
        <ApplyWorkspaceButton />
      </div>
    </>
  );
}

type SidebarEmptyMessageProps = Pick<
  SidebarWorkspaceNavProps,
  "emptyMessage"
> & {
  display?: boolean;
};

function SidebarEmptyMessage({
  emptyMessage,
  display,
}: SidebarEmptyMessageProps) {
  if (!display) {
    return null;
  }
  return (
    <div className="p-2">
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    </div>
  );
}

export function SidebarWorkspaceNav({
  title,
  items,
  type,
  emptyMessage = "등록된 워크스페이스가 없습니다.",
}: SidebarWorkspaceNavProps) {
  const { state } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between">
        <SidebarTitle title={title} type={type} />
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map(({ to, title, icon: IconComponent, ...item }) => (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton tooltip={title} asChild>
              <Link to={to} {...item}>
                {IconComponent && <IconComponent />}
                <span>{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarEmptyMessage
          emptyMessage={emptyMessage}
          display={items.length === 0 && state === "expanded"}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
