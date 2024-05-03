import { Form, useActionData } from "@remix-run/react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { schema } from "~/services/validate/register.validate";
import { type RoutesActionData } from "~/.server/routes/register/register.action";

export default function TabAccountForm() {
  // Last submission returned by the server
  const lastResult = useActionData<RoutesActionData>();

  const [form, fields] = useForm({
    id: "account-form",
    // Sync the result of last submission
    lastResult,
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    // Validate the form on blur event triggered
    shouldValidate: "onSubmit",
    shouldRevalidate: "onSubmit",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 생성</CardTitle>
        <CardDescription>계정을 생성하고, 지갑을 연결하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          className="space-y-2"
          method="post"
          id={form.id}
          onSubmit={form.onSubmit}
          aria-invalid={form.errors ? true : undefined}
          aria-describedby={form.errors ? form.errorId : undefined}
        >
          <div className="space-y-1">
            <Label htmlFor={fields.email.id}>이메일</Label>
            <Input
              id={fields.email.id}
              name={fields.email.name}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              required={fields.email.required}
              aria-label="Email address"
              aria-invalid={!fields.email.valid ? true : undefined}
              aria-describedby={
                !fields.email.valid
                  ? `${fields.email.errorId} ${fields.email.descriptionId}`
                  : fields.email.descriptionId
              }
              // disabled={isLoading || isGitHubLoading}
            />
            {fields?.email.errors && (
              <p
                id={fields.email.errorId}
                className="px-1 text-xs text-red-600"
              >
                {fields.email.errors}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor={fields.password.id}>비밀번호</Label>
            <Input
              id={fields.password.id}
              name={fields.password.name}
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              required={fields.password.required}
              aria-label="Password"
              aria-invalid={!fields.password.valid ? true : undefined}
              aria-describedby={
                !fields.password.valid
                  ? `${fields.password.errorId} ${fields.password.descriptionId}`
                  : fields.password.descriptionId
              }
              // disabled={isLoading || isGitHubLoading}
            />
            {fields?.password.errors && (
              <p
                id={fields.password.errorId}
                className="px-1 text-xs text-red-600"
              >
                {fields.password.errors}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor={fields.name.id}>이름</Label>
            <Input
              id={fields.name.id}
              name={fields.name.name}
              placeholder="exapmle"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              required={fields.name.required}
              aria-label="Password"
              aria-invalid={!fields.name.valid ? true : undefined}
              aria-describedby={
                !fields.name.valid
                  ? `${fields.name.errorId} ${fields.name.descriptionId}`
                  : fields.name.descriptionId
              }
              // disabled={isLoading || isGitHubLoading}
            />
            {fields?.name.errors && (
              <p id={fields.name.errorId} className="px-1 text-xs text-red-600">
                {fields.name.errors}
              </p>
            )}
          </div>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form={form.id}>
          회원가입
        </Button>
      </CardFooter>
    </Card>
  );
}
