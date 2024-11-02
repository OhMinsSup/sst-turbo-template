import type { FieldErrors } from "react-hook-form";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { FormFieldSignInSchema } from "@template/sdk";
import { schema } from "@template/sdk";
import { cn } from "@template/ui";
import { Button } from "@template/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@template/ui/form";
import { Input } from "@template/ui/input";

import type { RoutesActionData } from "~/.server/routes/auth/signup.action";
import { Icons } from "~/components/icons";
import { InputPassword } from "~/components/shared/InputPassword";

export default function SignInForm() {
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<RoutesActionData>();

  const isSubmittingForm = navigation.state === "submitting";

  const form = useForm<FormFieldSignInSchema>({
    progressive: true,
    resolver: zodResolver(schema.signIn),
    defaultValues: {
      email: "",
      password: "",
    },
    errors: (actionData?.result ?? undefined) as
      | FieldErrors<FormFieldSignInSchema>
      | undefined,
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (input: FormFieldSignInSchema) => {
    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("password", input.password);
    submit(formData, {
      method: "post",
    });
  };

  return (
    <div className="text-center">
      <span className="select-none font-bold">Instagram 계정으로 로그인</span>
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-1.5 py-4 text-start"
          id="signin-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      className={cn(
                        "h-14",
                        error?.message
                          ? "border-destructive focus-visible:ring-destructive"
                          : undefined,
                      )}
                      placeholder="이메일 주소"
                      autoCapitalize="none"
                      autoComplete="email"
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
              name="password"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormControl>
                    <InputPassword
                      placeholder="비밀번호"
                      className={cn(
                        "h-14",
                        error?.message
                          ? "border-destructive focus-visible:ring-destructive"
                          : undefined,
                      )}
                      autoComplete="current-password"
                      dir="auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              disabled={isSubmittingForm}
              aria-disabled={isSubmittingForm}
            >
              {isSubmittingForm ? (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              ) : null}
              <span>로그인</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
