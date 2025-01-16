import { useCallback, useEffect, useMemo } from "react";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
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

import type { RoutesActionData } from "~/.server/actions/_private._dashboard.dashboard._index.action";
import { queryWorkspaceKeys } from "~/libs/queries/workspace.queries";
import { useDataStore } from "~/providers/data.store";

interface EditWorkspaceFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditWorkspaceForm({ open, setOpen }: EditWorkspaceFormProps) {
  const fetcher = useFetcher<RoutesActionData<"createWorkspace">>({
    key: "dashboard:createWorkspace",
  });
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const searchParamsObj = useMemo(() => {
    const _searchParams = new URLSearchParams(searchParams);
    return Object.fromEntries(_searchParams.entries());
  }, [searchParams]);

  const actionData = fetcher.data;

  //   const isSubmittingForm = fetcher.state === "submitting";

  const form = useForm<FormFieldCreateWorkspace>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    errors:
      actionData && "error" in actionData
        ? (actionData.error ?? undefined)
        : undefined,
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const onSubmit = form.handleSubmit((input) => {
    const formData = new FormData();
    formData.append("submitId", useDataStore.getState().generateSubmitId());
    formData.append("intent", "createWorkspace");
    formData.append("title", input.title);
    if (input.description) {
      formData.append("description", input.description);
    }
    fetcher.submit(formData);
  });

  const onSussessSubmit = useCallback(async () => {
    if (actionData?.success) {
      if ("submitId" in actionData && "workspace" in actionData) {
        if (
          actionData.submitId &&
          useDataStore.getState().submitId() === actionData.submitId
        ) {
          setOpen(false);
          await queryClient.invalidateQueries({
            queryKey: queryWorkspaceKeys.list(searchParamsObj),
          });
        }
      }
    }
  }, [actionData, queryClient, searchParamsObj, setOpen]);

  useEffect(() => {
    return () => {
      form.reset();
      useDataStore.getState().resetSubmitId();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    onSussessSubmit();
  }, [onSussessSubmit]);

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
                    placeholder="제목"
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
                  <Textarea placeholder="설명" dir="auto" {...field} />
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
