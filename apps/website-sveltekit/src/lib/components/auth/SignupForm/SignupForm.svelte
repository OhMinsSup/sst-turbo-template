<script lang="ts">
  import type { SuperValidated } from "sveltekit-superforms";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { InputPassword } from "$lib/components/ui/input-password";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import type { FormFieldSignUpSchema } from "@template/sdk/schema";
  import { authSchema } from "@template/sdk/schema";

  export let data: SuperValidated<FormFieldSignUpSchema>;

  const form = superForm(data, {
    validators: zodClient(authSchema.signUp),
    dataType: "json",
  });

  const { form: formData, enhance } = form;
</script>

<div class="grid gap-6">
  <form id="signup-form" data-testid="signup-form" method="POST" use:enhance>
    <div class="grid gap-5">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>이메일</Form.Label>
          <Input
            data-testid="email"
            placeholder="example@example.com"
            autocapitalize="none"
            autocomplete="email"
            autocorrect="off"
            {...attrs}
            bind:value={$formData.email}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <Form.Label>비밀번호</Form.Label>
          <InputPassword
            data-testid="password"
            placeholder="비밀번호"
            autocomplete="current-password"
            {...attrs}
            bind:value={$formData.password}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="confirmPassword">
        <Form.Control let:attrs>
          <Form.Label>비밀번호 확인</Form.Label>
          <InputPassword
            data-testid="confirm-password"
            placeholder="비밀번호 확인"
            autocomplete="current-password"
            {...attrs}
            bind:value={$formData.confirmPassword}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Button type="submit" data-testid="signup-button">
        <span>회원가입</span>
      </Form.Button>
    </div>
  </form>
  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <span class="w-full border-t" />
    </div>
    <div class="relative flex justify-center text-xs uppercase">
      <span class="bg-background px-2 text-muted-foreground"> 또는 </span>
    </div>
  </div>
</div>
