import { useRef } from "react";
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

import type { RoutesActionData } from "~/.server/actions/signin.action";
import { Icons } from "~/components/icons";
import { uuid } from "~/libs/id";

interface StateRef {
  currentSubmitId: string | undefined;
}

const defaultStateRef: StateRef = {
  currentSubmitId: undefined,
};

export default function SignInForm() {
  const stateRef = useRef<StateRef>(defaultStateRef);
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<RoutesActionData>();

  const isSubmittingForm = navigation.state === "submitting";

  const form = useForm<FormFieldSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    errors: actionData?.error ?? undefined,
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const onSubmit = form.handleSubmit((input: FormFieldSignInSchema) => {
    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("provider", input.provider);
    stateRef.current.currentSubmitId = uuid();
    formData.append("submitId", stateRef.current.currentSubmitId);
    formData.append("intent", "signIn");
    submit(formData, {
      method: "post",
      replace: true,
    });
  });

  return (
    <div className="text-center">
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-1.5 text-start"
          onSubmit={onSubmit}
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
              disabled={isSubmittingForm}
              aria-disabled={isSubmittingForm}
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
