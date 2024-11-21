import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { FormFieldSignInSchema } from "@template/validators/auth";
import { Button } from "@template/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@template/ui/components/form";
import { Input } from "@template/ui/components/input";
import { InputPassword } from "@template/ui/components/input-password";
import { signInSchema } from "@template/validators/auth";

import type { RoutesActionData } from "~/.server/routes/auth/signin.action";
import { Icons } from "~/components/icons";

export default function SignInForm() {
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<RoutesActionData>();

  const isSubmittingForm = navigation.state === "submitting";

  const form = useForm<FormFieldSignInSchema>({
    progressive: true,
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    errors: actionData?.error ?? undefined,
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (input: FormFieldSignInSchema) => {
    console.log("input", input);
    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("password", input.password);
    submit(formData, {
      method: "post",
      replace: true,
    });
  };

  return (
    <div className="text-center">
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-1.5 text-start"
          id="signin-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
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
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputPassword
                      placeholder="비밀번호"
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
              // disabled={isSubmittingForm}
              // aria-disabled={isSubmittingForm}
            >
              {isSubmittingForm ? (
                <Icons.Spinner className="mr-2 size-4 animate-spin" />
              ) : null}
              <span>로그인</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
