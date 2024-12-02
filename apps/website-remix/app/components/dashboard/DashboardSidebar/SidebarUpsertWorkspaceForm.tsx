import React, { useEffect, useState } from "react";
import {
  useActionData,
  useLoaderData,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@template/ui/components/form";
import { Input } from "@template/ui/components/input";
import { Textarea } from "@template/ui/components/textarea";
import { createWorkspaceSchema } from "@template/validators/workspace";

import type { RoutesActionData } from "~/.server/routes/dashboard/dashboard.action";
import type { RoutesLoaderData } from "~/.server/routes/dashboard/dashboard.loader";
import { Icons } from "~/components/icons";

interface InternalSidebarApplyWorkspaceFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function InternalSidebarUpsertWorkspaceForm({
  setOpen,
}: InternalSidebarApplyWorkspaceFormProps) {
  const submit = useSubmit();
  const actionData = useActionData<RoutesActionData>();
  const data = useLoaderData<RoutesLoaderData>();

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
    formData.append("queryHashKey", data.queryHashKey);
    submit(formData, {
      method: "post",
      replace: true,
    });
  });

  const isFormSubmitting = actionData ? actionData.success : false;

  useEffect(() => {
    if (isFormSubmitting) {
      setOpen(false);
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormSubmitting]);

  return (
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
  );
}

export function SidebarUpsertWorkspaceForm() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  const isSubmittingForm = navigation.state === "submitting";

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
        <InternalSidebarUpsertWorkspaceForm setOpen={setOpen} />
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
