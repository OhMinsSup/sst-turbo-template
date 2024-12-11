import { useCallback, useEffect, useRef, useState } from "react";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
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

import type { RoutesActionData } from "~/.server/routes/workspaces/actions/dashboard._dashboard._index.action";
import { Icons } from "~/components/icons";
import { uuid } from "~/libs/id";

interface StateRef {
  currentSubmitId: string | undefined;
}

const defaultStateRef: StateRef = {
  currentSubmitId: undefined,
};

export function DialogEditWorkspace() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<RoutesActionData>();
  const stateRef = useRef<StateRef>(defaultStateRef);

  const isSubmittingForm = navigation.state === "submitting";

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
    stateRef.current.currentSubmitId = uuid();
    formData.append("submitId", stateRef.current.currentSubmitId);
    formData.append("title", input.title);
    if (input.description) {
      formData.append("description", input.description);
    }
    submit(formData, {
      method: "POST",
      replace: true,
    });
  });

  const onSussessSubmit = useCallback(() => {
    if (actionData?.success) {
      if ("submitId" in actionData && "workspace" in actionData) {
        if (
          actionData.submitId &&
          stateRef.current.currentSubmitId === actionData.submitId
        ) {
          setOpen(false);
          form.reset();
        }
      }
    }
  }, [actionData, form]);

  useEffect(() => {
    return () => {
      form.reset();
      stateRef.current = defaultStateRef;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    onSussessSubmit();
  }, [onSussessSubmit]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Icons.Plus />
          워크스페이스
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>워크스페이스</DialogTitle>
          <DialogDescription>
            나만의 워크스페이스를 만들어보세요.
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
