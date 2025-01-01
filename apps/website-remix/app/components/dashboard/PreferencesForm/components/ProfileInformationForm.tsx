import { useFetcher } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { FormFieldUpdateUser } from "@template/validators/user";
import { Button } from "@template/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@template/ui/components/form";
import { Input } from "@template/ui/components/input";
import { Separator } from "@template/ui/components/separator";
import { updateUserSchema } from "@template/validators/user";

import type { RoutesActionData } from "~/.server/actions/_private._dashboard.dashboard.account.me.action";
import { Icons } from "~/components/icons";
import { useUser } from "~/hooks/useUser";
import { useDataStore } from "~/providers/data.store";

export function ProfileInformationForm() {
  const user = useUser();

  const form = useForm<FormFieldUpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user.UserProfile.firstName ?? "",
      lastName: user.UserProfile.lastName ?? "",
    },
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const fetcher = useFetcher<RoutesActionData<"updateUser">>();

  const onSubmit = form.handleSubmit((input) => {
    const formData = new FormData();
    if (input.firstName) {
      formData.append("firstName", input.firstName);
    }
    if (input.lastName) {
      formData.append("lastName", input.lastName);
    }
    formData.append("submitId", useDataStore.getState().generateSubmitId());
    formData.append("intent", "updateUser");
    fetcher.submit(formData, {
      method: "post",
    });
  });

  const isSubmittingForm = fetcher.state === "submitting";

  return (
    <Form {...form}>
      <form id="profile-form" className="space-y-3" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-12 gap-6">
              <FormLabel className="col-span-4 flex items-center">
                이름
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="이름"
                  autoComplete="given-name"
                  className="col-span-8 h-[44px]"
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
          name="lastName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-12 gap-6">
              <FormLabel className="col-span-4 flex items-center">성</FormLabel>
              <FormControl>
                <Input
                  placeholder="성"
                  autoComplete="family-name"
                  className="col-span-8 h-[44px]"
                  dir="auto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <Separator className="mt-8" />
      <div className="flex items-center justify-end pt-3">
        <Button
          type="submit"
          form="profile-form"
          disabled={isSubmittingForm}
          aria-disabled={isSubmittingForm}
        >
          {isSubmittingForm ? (
            <Icons.Spinner className="mr-2 size-4 animate-spin" />
          ) : null}
          <span>저장</span>
        </Button>
      </div>
    </Form>
  );
}
