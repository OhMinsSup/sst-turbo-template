import { cn } from "~/utils/utils";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useActionData, Form } from "@remix-run/react";
import { schema } from "~/services/validate/sigin.validate";
import { type RoutesActionData } from "~/.server/routes/login/login.action";

export default function LoginForm() {
  // Last submission returned by the server
  const lastResult = useActionData<RoutesActionData>();

  const [form, fields] = useForm({
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
    <div className="grid gap-6">
      <Form
        method="post"
        id={form.id}
        onSubmit={form.onSubmit}
        aria-invalid={form.errors ? true : undefined}
        aria-describedby={form.errors ? form.errorId : undefined}
      >
        <div className="grid gap-2 space-y-3">
          <div className="grid gap-1">
            <Label htmlFor={fields.email.id}>이메일</Label>
            <Input
              id={fields.email.id}
              name={fields.email.name}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
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
          <div className="grid gap-1">
            <Label htmlFor={fields.password.id}>비밀번호</Label>
            <Input
              id={fields.password.id}
              name={fields.password.name}
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
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
          <button type="submit" className={cn(buttonVariants())}>
            {/* {isLoading && (
               <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
             )} */}
            로그인
          </button>
        </div>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        // onClick={() => {
        //   setIsGitHubLoading(true)
        //   signIn("github")
        // }}
        // disabled={isLoading || isGitHubLoading}
      >
        {/* {isGitHubLoading ? (
           <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
         ) : (
           <Icons.gitHub className="mr-2 h-4 w-4" />
         )}{" "} */}
        Github
      </button>
    </div>
  );
}
