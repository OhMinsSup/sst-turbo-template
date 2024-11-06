import type { FieldErrors } from "react-hook-form";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { FormFieldSignUpSchema } from "@template/validators/auth";
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
import { InputPassword } from "@template/ui/components/input-password";
import { cn } from "@template/ui/lib";
import { signUpSchema } from "@template/validators/auth";

import type { RoutesActionData } from "~/.server/routes/auth/signup.action";
import { Icons } from "~/components/icons";

export default function SignUpForm() {
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<RoutesActionData>();

  const isSubmittingForm = navigation.state === "submitting";

  const form = useForm<FormFieldSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    errors: actionData?.error,
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (input: FormFieldSignUpSchema) => {
    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("confirmPassword", input.confirmPassword);
    submit(input, {
      method: "post",
      replace: true,
    });
  };

  return (
    <div className="text-center">
      <span className="select-none font-bold">Instagram 계정으로 회원가입</span>
      <Form {...form}>
        <form
          id="signup-form"
          className="flex w-full flex-col gap-1.5 py-4 text-start"
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormControl>
                    <InputPassword
                      placeholder="비밀번호 확인"
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
              data-testid="signup-button"
            >
              {isSubmittingForm ? (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              ) : null}
              <span>회원가입</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
