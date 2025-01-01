import { Link, useFetcher } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { FormFieldAccount } from "@template/validators/user";
import { Button, buttonVariants } from "@template/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@template/ui/components/form";
import { Input } from "@template/ui/components/input";
import { Label } from "@template/ui/components/label";
import { Separator } from "@template/ui/components/separator";
import { cn } from "@template/ui/lib";
import { accountSchema } from "@template/validators/user";

import type { RoutesActionData } from "~/.server/actions/_private._dashboard.dashboard.account.me.action";
import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { useUser } from "~/hooks/useUser";
import { useDataStore } from "~/providers/data.store";

export function AccountInformationForm() {
  const user = useUser();

  const form = useForm<FormFieldAccount>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
    },
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const fetcher = useFetcher<RoutesActionData<"updateUser">>();

  const onSubmit = form.handleSubmit((input) => {
    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("submitId", useDataStore.getState().generateSubmitId());
    formData.append("intent", "updateUser");
    fetcher.submit(formData, {
      method: "post",
    });
  });

  const isSubmittingForm = fetcher.state === "submitting";

  return (
    <Form {...form}>
      <form id="account-form" className="space-y-3" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid grid-cols-12 gap-6">
              <FormLabel className="col-span-4 flex items-center">
                유저명
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="유저명"
                  autoComplete="username"
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
          name="email"
          render={({ field }) => (
            <FormItem className="grid grid-cols-12 gap-6">
              <FormLabel className="col-span-4 flex items-center">
                이메일
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="이메일"
                  autoComplete="email"
                  className="col-span-8 h-[44px]"
                  readOnly
                  dir="auto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-12 gap-6">
          <Label className="col-span-4 flex items-center">비밀번호</Label>
          <div className="col-span-8 flex h-[44px] items-center">
            <Link
              viewTransition
              to={PAGE_ENDPOINTS.PROTECTED.DASHBOARD.RESET_PASSWORD}
              className={cn(
                buttonVariants({
                  size: "sm",
                }),
              )}
            >
              비밀번호 변경
            </Link>
          </div>
        </div>
      </form>
      <Separator className="mt-8" />

      <div className="flex items-center justify-end pt-3">
        <Button
          type="submit"
          form="account-form"
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
