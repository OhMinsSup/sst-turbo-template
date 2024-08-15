<script lang="ts">
  import { Icons } from "$lib/components/icon";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { InputPassword } from "$lib/components/ui/input-password";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { authSchema } from "@template/sdk";

  import type { PageData } from "../../../../routes/(auth)/signin/$types";

  export let data: PageData;

  let loading = false;

  const form = superForm(data.form, {
    validators: zodClient(authSchema.signIn),
    dataType: "json",
    onSubmit: () => {
      loading = true;
    },
    onError: () => {
      loading = false;
    },
    onUpdate: () => {
      loading = false;
    },
  });

  const { form: formData, enhance, delayed } = form;
</script>

<div class="grid gap-6">
  <form id="signin-form" data-testid="signin-form" method="POST" use:enhance>
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
      <Form.Button type="submit" data-testid="signin-button">
        {#if loading}
          <Icons.spinner class="mr-2 size-4 animate-spin" />
        {/if}
        <span>로그인</span>
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
