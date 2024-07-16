<script lang="ts">
  import { Icons } from "$lib/components/icon";
  import { Button } from "$lib/components/ui/button";
</script>

<div
  class="container flex h-screen w-screen flex-col items-center justify-center"
>
  <Button
    href="/"
    variant="ghost"
    class="absolute left-4 top-4 md:left-8 md:top-8"
  >
    <Icons.chevronLeft class="mr-2 size-4" />
    뒤로가기
  </Button>
  <div
    class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
  >
    <div class="flex flex-col space-y-2 text-center">
      <Icons.logo class="mx-auto fill-current h-10" />
    </div>
    <slot />
    <p class="px-8 text-center text-sm text-muted-foreground">
      <a
        href="/signup"
        class="hover:text-brand underline underline-offset-4"
      >
        아직 계정이 없으신가요? 회원가입
      </a>
    </p>
  </div>
</div>
