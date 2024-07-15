<script lang="ts">
  import { Icons } from "$lib/components/icon";
  import { Button } from "$lib/components/ui/button";
</script>

<div
  class="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0"
>
  <Button
    href="/signin"
    variant="ghost"
    class="absolute right-4 top-4 md:right-8 md:top-8"
  >
    로그인
  </Button>
  <div class="hidden h-full bg-muted lg:block" />
  <div class="lg:p-8">
    <div
      class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
    >
      <div class="flex flex-col space-y-2 text-center">
        <Icons.logo class="mx-auto fill-current h-10" />
      </div>
      <slot></slot>
      <p class="space-x-3 px-8 text-center text-sm text-muted-foreground">
        <a href="/terms" class="hover:text-brand underline underline-offset-4">
          Sveltekit 약관
        </a>
        <a
          href="/privacy"
          class="hover:text-brand underline underline-offset-4"
        >
          개인정보처리방침
        </a>
        <a href="/cookie" class="hover:text-brand underline underline-offset-4">
          쿠키정책
        </a>
      </p>
    </div>
  </div>
</div>
