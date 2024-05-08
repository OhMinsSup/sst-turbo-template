import { Form, useActionData, useNavigation } from '@remix-run/react';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { Button } from '@template/ui/button';
import { Input } from '@template/ui/input';
import { Label } from '@template/ui/label';

import { type RoutesActionData } from '~/.server/routes/login.action';
import { Icons } from '~/components/icons';
import { ValidationMessage } from '~/components/shared/ValidationMessage';
import { schema } from '~/services/validate/sigin.validate';

export default function LoginForm() {
  // Last submission returned by the server
  const lastResult = useActionData<RoutesActionData>();

  const navigation = useNavigation();

  const isLoading = navigation.state === 'submitting';

  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult: lastResult?.message,
    id: 'login-form',
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    // Validate the form on blur event triggered
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onSubmit',
  });

  return (
    <div className="grid gap-6">
      <Form method="post" {...getFormProps(form)}>
        <div className="grid gap-2 space-y-3">
          <div className="grid gap-1">
            <Label htmlFor={fields.email.id}>이메일</Label>
            <Input
              {...getInputProps(fields.email, {
                type: 'email',
              })}
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              aria-label="Email address"
              disabled={isLoading}
            />
            {fields?.email.errors && (
              <ValidationMessage
                error={fields.email.errors[0] ?? null}
                isSubmitting={isLoading}
              />
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor={fields.password.id}>비밀번호</Label>
            <Input
              {...getInputProps(fields.password, {
                type: 'password',
              })}
              placeholder="********"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              aria-label="Password"
              disabled={isLoading}
            />
            {fields?.password.errors && (
              <ValidationMessage
                error={fields.password.errors[0] ?? null}
                isSubmitting={isLoading}
              />
            )}
          </div>
          <Button type="submit" className="space-x-2">
            {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
            <span>로그인</span>
          </Button>
        </div>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">또는</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        // onClick={() => {
        //   setIsGitHubLoading(true)
        //   signIn("github")
        // }}
        disabled={isLoading}
      >
        {/* {isGitHubLoading ? (
           <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
         ) : (
           <Icons.gitHub className="mr-2 h-4 w-4" />
         )}{" "} */}
        Github
      </Button>
    </div>
  );
}
