import { Form, useActionData, useNavigation } from '@remix-run/react';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { Button } from '@template/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@template/ui/card';
import { Input } from '@template/ui/input';
import { Label } from '@template/ui/label';

import { type RoutesActionData } from '~/.server/routes/register/register.action';
import { Icons } from '~/components/icons';
import { ValidationMessage } from '~/components/shared/ValidationMessage';
import { schema } from '~/services/validate/register.validate';

export default function TabAccountForm() {
  // Last submission returned by the server
  const lastResult = useActionData<RoutesActionData>();

  const navigation = useNavigation();

  const isLoading = navigation.state === 'submitting';

  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,
    id: 'account-form',
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    // Validate the form on blur event triggered
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onSubmit',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 생성</CardTitle>
        <CardDescription>계정을 생성하고, 지갑을 연결하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form className="space-y-2" method="post" {...getFormProps(form)}>
          <div className="space-y-1">
            <Label htmlFor={fields.email.id}>이메일</Label>
            <Input
              {...getInputProps(fields.email, { type: 'email' })}
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="off"
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
          <div className="space-y-1">
            <Label htmlFor={fields.password.id}>비밀번호</Label>
            <Input
              {...getInputProps(fields.password, { type: 'password' })}
              placeholder="********"
              autoCapitalize="none"
              autoComplete="off"
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
          <div className="space-y-1">
            <Label htmlFor={fields.username.id}>유저명</Label>
            <Input
              {...getInputProps(fields.username, { type: 'text' })}
              placeholder="exapmle"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Password"
              disabled={isLoading}
            />
            {fields?.username.errors && (
              <ValidationMessage
                error={fields.username.errors[0] ?? null}
                isSubmitting={isLoading}
              />
            )}
          </div>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form={form.id}>
          {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
          <span>회원가입</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
