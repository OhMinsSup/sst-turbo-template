import React, { useEffect } from "react";
import { useActionData, useSubmit } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { FormFieldCreateWorkspace } from "@template/validators/workspace";
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

import type { RoutesActionData } from "~/.server/routes/workspaces/dashboard-workspaces.action";
import type { SidebarFormComponentProps } from "~/components/shared/SidebarAddItemDialog";

type SidebarFormProps = SidebarFormComponentProps & {};

export default function SidebarForm({ setOpen }: SidebarFormProps) {
  const submit = useSubmit();
  const actionData = useActionData<RoutesActionData>();

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
