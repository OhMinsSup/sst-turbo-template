import { useMemo, useState } from "react";
import { useFetcher } from "@remix-run/react";

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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@template/ui/components/sheet";
import { MEDIA_QUERY, useMediaQuery } from "@template/ui/hooks";
import { cn } from "@template/ui/lib";

import type { RoutesActionData } from "~/.server/actions/_private._dashboard.dashboard._index.action";
import { Icons } from "~/components/icons";
import { EditWorkspaceForm } from "./EditWorkspaceForm";

const Keys = [
  "Root",
  "Trigger",
  "Header",
  "Title",
  "Description",
  "Footer",
  "Content",
] as const;

const DialogComponents = {
  DialogRoot: Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};

const SheetComponents = {
  SheetRoot: Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};

const responsiveComponents = <Schema extends "Sheet" | "Dialog">(
  schema: Schema,
) => {
  const target = schema === "Sheet" ? SheetComponents : DialogComponents;
  const components = Keys.reduce(
    (acc, key) => {
      acc[key] = target[`${schema}${key}` as keyof typeof target];
      return acc;
    },
    {} as {
      [K in (typeof Keys)[number]]: Schema extends "Sheet"
        ? (typeof SheetComponents)[`${Schema}${K}`]
        : Schema extends "Dialog"
          ? (typeof DialogComponents)[`${Schema}${K}`]
          : never;
    },
  );

  return components;
};

export function DialogEditWorkspace() {
  const isMobile = useMediaQuery(MEDIA_QUERY.small, false);
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher<RoutesActionData<"createWorkspace">>({
    key: "dashboard:createWorkspace",
  });

  const isSubmittingForm = fetcher.state === "submitting";

  const Components = useMemo(
    () => responsiveComponents(isMobile ? "Sheet" : "Dialog"),
    [isMobile],
  );

  return (
    <Components.Root onOpenChange={setOpen} open={open}>
      <Components.Trigger asChild>
        <Button size="sm" variant="ghost">
          <Icons.Plus />
          <span>워크스페이스</span>
        </Button>
      </Components.Trigger>
      <Components.Content
        side={isMobile ? "bottom" : undefined}
        className={cn({
          "sm:max-w-[425px]": !isMobile,
        })}
      >
        <Components.Header>
          <Components.Title>워크스페이스</Components.Title>
          <Components.Description>
            나만의 워크스페이스를 만들어보세요.
          </Components.Description>
        </Components.Header>
        <EditWorkspaceForm setOpen={setOpen} open={open} />
        <Components.Footer>
          <Button
            disabled={isSubmittingForm}
            aria-disabled={isSubmittingForm}
            type="submit"
            form="create-workspace-form"
          >
            {isSubmittingForm ? (
              <Icons.Spinner className="mr-2 size-4 animate-spin" />
            ) : null}
            <span>등록</span>
          </Button>
        </Components.Footer>
      </Components.Content>
    </Components.Root>
  );
}
